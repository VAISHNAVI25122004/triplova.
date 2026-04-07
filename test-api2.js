import fs from 'fs';

async function test() {
    console.log("Testing POST to category.php with trip_type");
    const formData = new FormData();
    formData.append('category_name', 'Test Educational Tour');
    formData.append('category_description', 'A test tour for educational purposes');
    formData.append('trip_type', 'educational'); // Just guessing

    // AdminPanel sends these:
    formData.append('name', 'Test Educational Tour');
    formData.append('destination', 'Global');
    formData.append('price', '2000');
    formData.append('duration', '10 Days');

    // create a dummy file
    fs.writeFileSync('educational_tour.jpg', 'fake image data');
    const blob = new Blob([fs.readFileSync('educational_tour.jpg')], { type: 'image/jpeg' });
    formData.append('image', blob, 'educational_tour.jpg');
    formData.append('category_image', blob, 'educational_tour.jpg');

    const res = await fetch('https://triplova.com/triplova-project/api/admin/category.php', {
        method: 'POST',
        body: formData
    });
    const text = await res.text();
    console.log("Response:", text);
}
test();
