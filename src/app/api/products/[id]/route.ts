import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveSeller } from "@/lib/seller";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/*
|--------------------------------------------------------------------------
| PATCH PRODUCT
|--------------------------------------------------------------------------
| Allows an active seller to edit their own product.
|
| Supported fields:
| - name
| - description
| - price
| - imageUrl
| - category
| - location
| - stock
|--------------------------------------------------------------------------
*/

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const seller = await getActiveSeller();

    if (!seller) {
      return NextResponse.json(
        {
          error:
            "Active seller subscription required.",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    /*
     * Find the product and verify ownership.
     */
    const existingProduct =
      await prisma.product.findFirst({
        where: {
          id,
          advertiserId: seller.advertiser.id,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        {
          error:
            "Product not found or you do not have permission to edit it.",
        },
        { status: 404 }
      );
    }

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

    /*
     * Build update data only from fields
     * that were actually provided.
     */
    const updateData: {
      name?: string;
      description?: string | null;
      price?: number;
      imageUrl?: string | null;
      category?: string;
      location?: string | null;
      stock?: number;
    } = {};

    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (!cleanName) {
        return NextResponse.json(
          {
            error:
              "Product name cannot be empty.",
          },
          { status: 400 }
        );
      }

      updateData.name = cleanName;
    }

    if (description !== undefined) {
      updateData.description =
        description === null ||
        String(description).trim() === ""
          ? null
          : String(description).trim();
    }

    if (price !== undefined) {
      const numericPrice = Number(price);

      if (
        !Number.isFinite(numericPrice) ||
        numericPrice < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid product price.",
          },
          { status: 400 }
        );
      }

      updateData.price = numericPrice;
    }

    if (imageUrl !== undefined) {
      updateData.imageUrl =
        imageUrl === null ||
        String(imageUrl).trim() === ""
          ? null
          : String(imageUrl).trim();
    }

    if (category !== undefined) {
      updateData.category =
        String(category).trim() || "Other";
    }

    if (location !== undefined) {
      updateData.location =
        location === null ||
        String(location).trim() === ""
          ? null
          : String(location).trim();
    }

    if (stock !== undefined) {
      const numericStock = Number(stock);

      if (
        !Number.isInteger(numericStock) ||
        numericStock < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Stock must be a whole number greater than or equal to 0.",
          },
          { status: 400 }
        );
      }

      updateData.stock = numericStock;
    }

    /*
     * Prevent an empty update.
     */
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          error:
            "No product changes were provided.",
        },
        { status: 400 }
      );
    }

    const updatedProduct =
      await prisma.product.update({
        where: {
          id: existingProduct.id,
        },

        data: updateData,

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

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update product.",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| DELETE PRODUCT
|--------------------------------------------------------------------------
| Allows an active seller to delete their own product.
|--------------------------------------------------------------------------
*/

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const seller = await getActiveSeller();

    if (!seller) {
      return NextResponse.json(
        {
          error:
            "Active seller subscription required.",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    /*
     * Verify ownership before deleting.
     */
    const existingProduct =
      await prisma.product.findFirst({
        where: {
          id,
          advertiserId: seller.advertiser.id,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        {
          error:
            "Product not found or you do not have permission to delete it.",
        },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: {
        id: existingProduct.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete product.",
      },
      { status: 500 }
    );
  }
}