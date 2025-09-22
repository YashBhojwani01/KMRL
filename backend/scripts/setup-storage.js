const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function setupStorage() {
    console.log('🔧 Setting up Supabase Storage for Email Attachments...\n');

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        console.error('❌ Missing Supabase configuration in .env file');
        return;
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

    try {
        // Check if bucket exists
        console.log('📋 Checking existing storage buckets...');
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
            console.error('❌ Error accessing storage:', listError.message);
            console.log('\n🔧 Manual Setup Required:');
            console.log('1. Go to your Supabase Dashboard');
            console.log('2. Navigate to Storage');
            console.log('3. Create a new bucket named "email-attachments"');
            console.log('4. Set it as public');
            console.log('5. Run the SQL script: scripts/setup-storage.sql');
            return;
        }

        const bucketExists = buckets.some(bucket => bucket.name === 'email-attachments');
        
        if (bucketExists) {
            console.log('✅ email-attachments bucket already exists');
        } else {
            console.log('❌ email-attachments bucket not found');
            console.log('\n🔧 Manual Setup Required:');
            console.log('1. Go to your Supabase Dashboard');
            console.log('2. Navigate to Storage');
            console.log('3. Create a new bucket named "email-attachments"');
            console.log('4. Set it as public');
            console.log('5. Run the SQL script: scripts/setup-storage.sql');
        }

        // Test upload
        console.log('\n🧪 Testing storage access...');
        const testData = Buffer.from('test file content');
        const testPath = 'test/test-file.txt';
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('email-attachments')
            .upload(testPath, testData, {
                contentType: 'text/plain'
            });

        if (uploadError) {
            console.error('❌ Storage test failed:', uploadError.message);
            console.log('\n🔧 RLS Configuration Required:');
            console.log('1. Go to your Supabase Dashboard');
            console.log('2. Navigate to SQL Editor');
            console.log('3. Run the script: scripts/setup-storage.sql');
            console.log('4. This will disable RLS on storage.objects');
        } else {
            console.log('✅ Storage test successful!');
            
            // Clean up test file
            await supabase.storage
                .from('email-attachments')
                .remove([testPath]);
            console.log('🧹 Test file cleaned up');
        }

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.log('\n🔧 Manual Setup Required:');
        console.log('1. Create bucket "email-attachments" in Supabase Dashboard');
        console.log('2. Set bucket as public');
        console.log('3. Run SQL script to disable RLS');
    }
}

// Run the setup
setupStorage();
