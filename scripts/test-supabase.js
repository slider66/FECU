const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

async function testSupabaseConnection() {
    console.log("Testing Supabase connection...\n");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Check environment variables
    console.log("Environment variables:");
    console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? `✓ Set (${supabaseUrl})` : "✗ Missing");
    console.log("SUPABASE_SERVICE_ROLE_KEY:", supabaseKey ? `✓ Set (${supabaseKey.substring(0, 20)}...)` : "✗ Missing");
    console.log();

    if (!supabaseUrl || !supabaseKey) {
        console.error("❌ Missing required environment variables!");
        console.log("\nPlease add these to your .env file:");
        console.log("NEXT_PUBLIC_SUPABASE_URL=your-supabase-url");
        console.log("SUPABASE_SERVICE_ROLE_KEY=your-service-role-key");
        return;
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    try {
        console.log("Attempting to connect to Supabase...");

        // List storage buckets
        const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();

        if (error) {
            console.error("❌ Error connecting to Supabase Storage:");
            console.error(error);
            return;
        }

        console.log("✅ Successfully connected to Supabase!");
        console.log("\nAvailable buckets:");
        if (buckets && buckets.length > 0) {
            buckets.forEach((bucket) => {
                console.log(`  - ${bucket.name} (${bucket.public ? "public" : "private"})`);
            });
        } else {
            console.log("  No buckets found");
        }

        // Check if repair-photos bucket exists
        const repairPhotosBucket = buckets?.find((b) => b.name === "repair-photos");
        if (repairPhotosBucket) {
            console.log("\n✅ 'repair-photos' bucket exists");
        } else {
            console.log("\n⚠️  'repair-photos' bucket NOT found");
            console.log("You need to create it in Supabase Dashboard:");
            console.log("1. Go to Storage in your Supabase project");
            console.log("2. Create a new bucket named 'repair-photos'");
            console.log("3. Make it public if you want direct image access");
        }
    } catch (error) {
        console.error("❌ Unexpected error:");
        console.error(error.message || error);
    }
}

testSupabaseConnection();
