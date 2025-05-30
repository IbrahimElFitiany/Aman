const { User , House} = require('../models/index');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/authMiddleware');
const {sendEmail} = require("../services/nodemailer")

function generateLoginToken (user,userHouse){
    return generateToken({
    user_id: user.user_id,
    username: user.username,
    house_id: userHouse.house_id,
    isThief: user.is_thief
    });
}

const authController = {
    loginUser: async (req, res) => {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ where: {username} });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userHouse = await House.findOne({ where: { user_id: user.user_id} }); 

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                user.failed_logins += 1;
                await user.save();

                if (user.failed_logins >= 3){
                    await user.update({ is_thief: true });
                    const token = generateLoginToken(user , userHouse);

                    sendEmail(user.email);


                    console.log(token)
                    return res.status(200).json({ message: 'Login successful (flagged as thief)'});
                }
                return res.status(401).json({ error: 'Invalid credentials' });
            }


            user.failed_logins = 0;
            user.is_thief = false;
            user.save()
            await user.save();

            const token = generateLoginToken(user , userHouse);

            console.log("Token: " + token)
            res.status(200).json({ message: 'Login successful', user});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = authController;
