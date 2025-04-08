const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require("nodemailer");
const ExcelJS = require('exceljs');
const path = require('path');

const app = express();
const port = 4000;
const filePath = path.join(__dirname, 'emails.xlsx');

// ✅ Enable CORS & JSON Parsing
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Configure Nodemailer
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: "abdulrahman3863@gmail.com", // Change this
        pass: "sgnzbqayxwtjcakn",   // Use an **App Password**, NOT your Gmail password
    },
});

// ✅ Function to Save Name & Email to Excel
const saveDataToExcel = async (name, email, number) => {
    const workbook = new ExcelJS.Workbook();
    let worksheet;

    if (fs.existsSync(filePath)) {
        await workbook.xlsx.readFile(filePath);
        worksheet = workbook.getWorksheet('Subscribers');
    }

    if (!worksheet) {
        worksheet = workbook.addWorksheet('Subscribers');
        worksheet.addRow(['Name', 'Email', 'Number']); // Add header if new
    }

    worksheet.addRow([name, email, number]); // Append new row
    await workbook.xlsx.writeFile(filePath);
    console.log(`✅ Data saved: ${name} - ${email} - ${number}`);
};
    
// ✅ Route to Handle Name & Email Submission
app.post('/emails', async (req, res) => {
    const { name, email, number } = req.body;

    if (!name || !email || !number) {
        return res.status(400).json({ message: '❌ Name and Email are required' });
    }

    const mailOptions = {
        from: 'sunwestglobalgeneral@gmail.com',
        to: email,
        subject: `Welcome, ${name}!`,
        text: `Hi ${name},\n\nThank you for subscribing to our website!\n\nBest regards,\nYour Website Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        await saveDataToExcel(name, email, number);
        console.log('✅ Email sent successfully!');
        res.status(200).json({ status: true, message: '✅ Subscription successful!' });
    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({ status: false, message: '❌ Failed to send email.' });
    }
});

// ✅ Route to Fetch Subscribers from Excel
app.get('/emails', async (req, res) => {
    if (!fs.existsSync(filePath)) {
        return res.status(200).json({ subscribers: [], message: "No subscribers found" });
    }

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet('Subscribers');

        if (!worksheet) {
            return res.status(200).json({ subscribers: [], message: "No data found" });
        }

        // Read data from Excel and convert to JSON
        const subscribers = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header row
                const name = row.getCell(1).value;
                const email = row.getCell(2).value;
                const number = row.getCell(3).value;
                subscribers.push({ name, email ,number });
            }
        });

        res.json({ subscribers });
    } catch (error) {
        console.error('❌ Error reading Excel file:', error);
        res.status(500).json({ message: "❌ Failed to read subscribers" });
    }
});

// ✅ Start the Server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
