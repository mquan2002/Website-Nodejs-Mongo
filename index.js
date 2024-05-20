const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/Database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error in connection to database"));
db.once('open', () => console.log("Connected to database"));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    gender: String,
    password: String
});

const User = mongoose.model('users', userSchema, 'users');

// Hàm kiểm tra tính hợp lệ của email
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Hàm kiểm tra tính hợp lệ của số điện thoại
function validatePhoneNumber(phoneNumber) {
    const re = /^[0-9]{10}$/;
    return re.test(phoneNumber);
}

app.post("/login", async (req, res) => {
    try {
        console.log("Nhận yêu cầu đăng nhập:", req.body);

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email: email, password: password });

        if (!user) {
            console.log("Đăng nhập không thành công: Email hoặc mật khẩu không đúng.");
            return res.status(400).json({ error: "Email hoặc mật khẩu không đúng." });
        }

        // Handle successful login here
        console.log("Đăng nhập thành công");
        return res.redirect('/main.html');
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        return res.status(500).json({ error: "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau." });
    }
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, phoneNumber, gender, password } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!name || !email || !phoneNumber || !gender || !password) {
            console.log("Đăng ký không thành công: Thiếu thông tin.");
            return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin." });
        }

        if (!validateEmail(email)) {
            console.log("Đăng ký không thành công: Email không hợp lệ.");
            return res.status(400).json({ error: "Email không hợp lệ." });
        }

        if (!validatePhoneNumber(phoneNumber)) {
            console.log("Đăng ký không thành công: Số điện thoại không hợp lệ.");
            return res.status(400).json({ error: "Số điện thoại không hợp lệ." });
        }

        // Kiểm tra xem email đã được sử dụng chưa
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            console.log("Đăng ký không thành công: Email đã được sử dụng.");
            return res.status(400).json({ error: "Email đã được sử dụng." });
        }

        // Tạo người dùng mới
        const newUser = new User({
            name,
            email,
            phoneNumber,
            gender,
            password
        });

        // Lưu người dùng vào cơ sở dữ liệu
        await newUser.save();
        console.log("Tài khoản được đăng ký thành công");

        // Chuyển hướng sang trang đăng ký thành công
        return res.redirect('/register_success');

    } catch (error) {
        console.error("Lỗi khi đăng ký tài khoản:", error);
        return res.status(500).json({ error: "Đã xảy ra lỗi khi đăng ký tài khoản. Vui lòng thử lại sau." });
    }
});

app.get("/register_success", (req, res) => {
    // Chuyển hướng về trang chính (index.html)
    return res.redirect('/index.html');
});



app.post("/check_duplicate_data", async (req, res) => {
    try {
        const { email, phoneNumber, name } = req.body;

        // Kiểm tra xem email, số điện thoại hoặc tên đã được sử dụng chưa
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { phoneNumber: phoneNumber },
                { name: name }
            ]
        });

        if (existingUser) {
            const response = {
                exists: true,
                emailExists: existingUser.email === email,
                phoneNumberExists: existingUser.phoneNumber === phoneNumber,
                nameExists: existingUser.name === name
            };
            return res.status(200).json(response);
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error("Lỗi khi kiểm tra trùng lặp dữ liệu:", error);
        return res.status(500).json({ error: "Đã xảy ra lỗi khi kiểm tra trùng lặp dữ liệu." });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
