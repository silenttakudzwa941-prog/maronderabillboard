import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveSeller } from "@/lib/seller";

/*
|--------------------------------------------------------------------------
| GET PRODUCTS
|--------------------------------------------------------------------------
| Public endpoint.
|
| Supports:
| /api/products
| /api/products?search=phone
| /api/products?category=Electronics
| /api/products?location=Harare
| /api/products?advertiserId=xxxx
| /api/products?id=xxxx
|--------------------------------------------------------------------------
*/

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const location = searchParams.get("location")?.trim() || "";
    const advertiserId =
      searchParams.get("advertiserId")?.trim() || "";
    const id = searchParams.get("id")?.trim() || "";

    const products = await prisma.product.findMany({
      where: {
        /*
         * Every public product request must belong
         * to an active seller.
         */
        status: "active",

        advertiser: {
          sellerSubscription: {
            status: "active",
            expiresAt: {
              gt: new Date(),
            },
          },
        },

        ...(id
          ? {
              id,
            }
          : {}),

        ...(advertiserId
          ? {
              advertiserId,
            }
          : {}),

        ...(category
          ? {
              category,
            }
          : {}),

        ...(location
          ? {
              location,
            }
          : {}),

        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  category: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },

      include: {
        advertiser: {
          select: {
            id: true,
            businessName: true,
            phone: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch products",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST PRODUCT
|--------------------------------------------------------------------------
| Creates a product for an active seller.
|--------------------------------------------------------------------------
*/

export async function POST(request: Request) {
  try {
    const seller = await getActiveSeller();

    if (!seller) {
      return NextResponse.json(
        {
          error:
            "Active seller subscription required. Please subscribe for $50/month and wait for admin verification.",
        },
        {
          status: 403,
        }
      );
    }

    const advertiser = seller.advertiser;

    const body = await request.json();

    const {
      name,
      description,
      price,
      imageUrl,
      category,
      location,
      stock,
    } = body;

    if (!name || !price) {
      return NextResponse.json(
        {
          error: "Product name and price are required",
        },
        {
          status: 400,
        }
      );
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        {
          error: "Invalid product price",
        },
        {
          status: 400,
        }
      );
    }

    const numericStock =
      stock === undefined || stock === null || stock === ""
        ? 1
        : Number(stock);

    if (!Number.isInteger(numericStock) || numericStock < 0) {
      return NextResponse.json(
        {
          error:
            "Stock must be a whole number greater than or equal to 0",
        },
        {
          status: 400,
        }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: String(name).trim(),

        description: description
          ? String(description).trim()
          : null,

        price: numericPrice,

        imageUrl: imageUrl
          ? String(imageUrl).trim()
          : null,

        category: category
          ? String(category).trim()
          : "Other",

        location: location
          ? String(location).trim()
          : null,

        stock: numericStock,

        advertiserId: advertiser.id,
      },

      include: {
        advertiser: {
          select: {
            id: true,
            businessName: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create product",
      },
      {
        status: 500,
      }
    );
  }
}