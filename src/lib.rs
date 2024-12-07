use wasm_bindgen::prelude::*;
use image::{ ImageReader};
use color_thief::{ get_palette, ColorFormat};
use std::io::Cursor;

#[wasm_bindgen]
pub fn color_ratio(image_data: &[u8]) -> String {
    let img = match ImageReader::new(Cursor::new(image_data))
        .with_guessed_format()
        .unwrap()
        .decode()
    {
        Ok(img) => img,
        Err(_) => return "Error decoding image".to_string(),
    };

    let rgb_img = img.to_rgb8();
    let width = rgb_img.width();
    let height = rgb_img.height();

    let mut pixel_data: Vec<u8> = Vec::with_capacity((width * height * 3) as usize);

    for y in 0..height {
        for x in 0..width {
            let pixel = rgb_img.get_pixel(x, y);
            pixel_data.extend_from_slice(&pixel.0);
        }
    }
    match get_palette(&pixel_data, ColorFormat::Rgb, 10,255) {
        Ok(palette) => {
            let mut result = String::new();
            for color in palette {
                result.push_str(&format!("#{:02X}{:02X}{:02X}", color.r, color.g, color.b));
                result.push('\n');
            }
            result
        }
        Err(_) => "Error getting color palette".to_string(),
    }
}