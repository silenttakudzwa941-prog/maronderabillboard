import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getActiveSeller } from "@/lib/seller";
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(request: Request) {
  try {
   /*
 * Check that the user is an active seller.
 *
 * This verifies:
 * - The user is logged in
 * - The advertiser profile exists
 * - The seller subscription exists
 * - The subscription is active
 * - The subscription has not expired
 */
const seller = await getActiveSeller();

if (!seller) {
  return NextResponse.json(
    {
      error:
        "Active seller subscription required. Please subscribe for $50/month and wait for admin verification.",
    },
    { status: 403 }
  );
}

const user = seller.advertiser;

    /*
     * Get uploaded file
     */
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No product image was provided.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate image type
     */
    if (!allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Unsupported image type. Please upload JPG, PNG or WEBP.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate image size
     */
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        {
          error:
            "Image is too large. Maximum size is 10MB.",
        },
        { status: 400 }
      );
    }

    /*
     * Supabase environment variables
     */
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl) {
      console.error(
        "Supabase storage environment variables are missing."
      );

      return NextResponse.json(
        {
          error:
            "Server storage configuration is missing.",
        },
        { status: 500 }
      );
    }

    /*
     * Create Supabase storage client
     */
    const storageClient = createClient(
      supabaseUrl,
      serviceRoleKey
    );

    /*
     * Create a safe unique filename
     */
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeExtension = extension.replace(
      /[^a-z0-9]/g,
      ""
    );

    const fileName = `${crypto.randomUUID()}.${safeExtension}`;

    /*
     * Keep each advertiser's images
     * inside their own folder.
     */
    const filePath = `${user.id}/${fileName}`;

    const fileBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    /*
     * Upload image
     */
    const { error: uploadError } =
      await storageClient.storage
        .from("product-images")
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: false,
        });

    if (uploadError) {
      console.error(
        "Supabase product image upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          error:
            "Failed to upload product image.",
        },
        { status: 500 }
      );
    }

    /*
     * Verify that the uploaded image exists
     */
    const {
      data: files,
      error: listError,
    } = await storageClient.storage
      .from("product-images")
      .list(user.id, {
        search: fileName,
        limit: 10,
      });

    if (listError) {
      console.error(
        "Supabase product image verification error:",
        listError
      );

      return NextResponse.json(
        {
          error:
            "The product image uploaded but could not be verified in storage.",
        },
        { status: 500 }
      );
    }

    const uploadedFileExists = files?.some(
      (storedFile) => storedFile.name === fileName
    );

    if (!uploadedFileExists) {
      console.error(
        "Product image upload returned success, but the object was not found:",
        filePath
      );

      return NextResponse.json(
        {
          error:
            "The product image upload could not be verified. Please try again.",
        },
        { status: 500 }
      );
    }

    /*
     * Generate public URL
     */
    const {
      data: { publicUrl },
    } = storageClient.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      path: filePath,
      publicUrl,
      fileName: file.name,
      mediaType: "image",
    });
  } catch (error) {
    console.error(
      "Product image upload error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to upload product image.",
      },
      { status: 500 }
    );
  }
}