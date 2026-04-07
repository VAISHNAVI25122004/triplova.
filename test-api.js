import fs from 'fs';

async function test() {
    const formData = new FormData();
    formData.append('childCategory_name', 'Test New Package');
    formData.append('location', 'Test Dest');
    formData.append('price', '999');

    // create a dummy file
    const blob = new Blob([fs.readFileSync('dummy.jpg')], { type: 'image/jpeg' });
    formData.append('childCategory_image', blob, 'dummy.jpg');

    const res = await fetch('https://triplova.com/triplova-project/api/admin/childcategory.php', {
        method: 'POST',
        body: formData
    });
    const text = await res.text();
    console.log("Response:", text);
}
test();
