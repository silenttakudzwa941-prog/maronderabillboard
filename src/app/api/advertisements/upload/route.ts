import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const allowedVideoTypes = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export async function POST(request: Request) {
  try {
    // Check that the advertiser is logged in
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "You must be logged in to upload an advertisement.",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No advertisement file was provided.",
        },
        { status: 400 }
      );
    }

    const isImage = allowedImageTypes.includes(file.type);
    const isVideo = allowedVideoTypes.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Please upload JPG, PNG, WEBP, MP4, WEBM or MOV.",
        },
        { status: 400 }
      );
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: isImage
            ? "Image is too large. Maximum size is 10MB."
            : "Video is too large. Maximum size is 50MB.",
        },
        { status: 400 }
      );
    }

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      console.error(
        "SUPABASE_SERVICE_ROLE_KEY is not configured."
      );

      return NextResponse.json(
        {
          error: "Server storage configuration is missing.",
        },
        { status: 500 }
      );
    }

    const storageClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "bin";

    const safeExtension = extension.replace(
      /[^a-z0-9]/g,
      ""
    );

    const fileName = `${crypto.randomUUID()}.${safeExtension}`;

    // Store each advertiser's files inside their own folder
    const filePath = `${user.id}/${fileName}`;

    const fileBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    const { error: uploadError } =
      await storageClient.storage
        .from("advertisements")
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: false,
        });

    if (uploadError) {
      console.error(
        "Supabase storage upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          error: "Failed to upload advertisement media.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      path: filePath,
      fileName: file.name,
      mediaType: isImage ? "image" : "video",
    });
  } catch (error) {
    console.error(
      "Advertisement upload error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to upload advertisement media.",
      },
      { status: 500 }
    );
  }
}