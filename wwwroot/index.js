 import init, { color_ratio } from './rust_colorratio.js';

const mainImg =  document.getElementById("mainImg");

async function run() {
     await init();

    document.getElementById("file_input").addEventListener("change", async (event) => {
        const files = document.getElementById("file_input").files;
        if (files.length === 0) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            mainImg.src = e.target.result;
            mainImg.style.display = 'block';
        };
        reader.readAsDataURL(files[0]);
    });

    document.getElementById("outputColorCode").addEventListener("click",async()=>{
        const files = document.getElementById("file_input").files;
        if (files.length === 0) {
            window.alert("写真を選択してください。")
            return;
        }
        const file_blob = new Blob([files[0]], { type: files[0].type });
        await blobToUint8Array(file_blob)
            .then(uint8Array => {
                document.getElementById("outputText").innerText = color_ratio(uint8Array);
            })
            .catch(error => {
                console.error('Error converting blob:', error);
            });
    });

}
run();

async function blobToUint8Array(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(new Uint8Array(reader.result));
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
}