const { createClient } = require('@supabase/supabase-js');

async function main(){
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url || !key){
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(2);
  }
  const supabase = createClient(url, key);
  const bucket = 'products';
  const path = 'debug/test-upload.webp';
  const data = Buffer.from('test');
  try{
    const res = await supabase.storage.from(bucket).upload(path, data, { contentType: 'image/webp', upsert: true });
    console.log('upload result', res);
  }catch(err){
    console.error('error', err);
  }
}

main();
