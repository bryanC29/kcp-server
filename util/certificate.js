import {
    createCanvas,
    loadImage,
    registerFont,
} from "canvas";
import sharp from "sharp";
import fs from "fs";
import QRCode from "qrcode";

export const genVerifyCertificate = async (data) => {
    registerFont("../assets/Crimson-Italic.ttf", { family: "Crimson" });
    registerFont("../assets/AVANTE.TTF", { family: "Avante" });
    
    const templatePath = "../assets/kcp_certificate_template.png";
    const template = await sharp(templatePath).metadata();

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");

    const templateImage = await loadImage(templatePath);
    ctx.drawImage(templateImage, 0, 0, template.width, template.height);

    ctx.fillStyle = "#000";
    ctx.font = "200px Crimson";

    const nameX = 1085;
    const nameY = 1300;
    ctx.fillText(data.name, nameX, nameY);

    ctx.font = "80px Times New Roman";

    const courseX = 2520;
    const courseY = 1435;
    ctx.fillText(data.course, courseX, courseY);

    ctx.font = "70px Times New Roman";

    const startX = 2860;
    const startY = 1525;
    ctx.fillText(data.start, startX, startY);

    const endX = 1170;
    const endY = 1605;
    ctx.fillText(data.end, endX, endY);

    const dateX = 1530;
    const dateY = 1750;
    ctx.fillText(data.date, dateX, dateY);

    ctx.fillStyle = "#958fa2";
    ctx.font = "50px Avante";

    const idX = 2600;
    const idY = 120;
    ctx.fillText(`ID: ${data.certificateID}`, idX, idY);

    const qrCodeUrl = `https://localhost:4560/certificate/verify/${encodeURIComponent(data.certificateID)}`;
    const qrCodeSize = 350;

    const qrCodeBuffer = await QRCode.toBuffer(qrCodeUrl, { width: qrCodeSize, margin: 1 });

    const qrCodeImage = await loadImage(qrCodeBuffer);
    const qrX = 2820;
    const qrY = 450;
    ctx.drawImage(qrCodeImage, qrX, qrY, qrCodeSize, qrCodeSize);

    const buffer = canvas.toBuffer("image/png");
    // const fileName = `certificate-${data.certificateID}.png`;

    // fs.writeFileSync(`../assets/${fileName}`, buffer);

    return buffer;
}

// console.log(await generateCertificate({ name: "Bryan Christy", certificateID: "677a9e3a1242aa90b7d3bd7e", course: 'Web Development', start: 'November, 2024', end: 'December, 2024', date: '25 December, 2024' }));