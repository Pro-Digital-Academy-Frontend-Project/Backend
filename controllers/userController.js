const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken } = require('../middleware/authMiddleware');

exports.registerUser = async (req, res) => {
  const { account_id, password, nickname, slack_id } = req.body;
  if (!account_id || !password || !nickname) {
    return res.status(400).json({ message: '필수 입력 필드가 누락되었습니다.' });
  }

  User.create({ account_id, password, nickname, slack_id }, (err, results) => {
    if (err) {
      return res.status(500).json({ error: '회원가입에 실패했습니다.' });
    }
    res.status(201).json({ message: '회원가입 성공', userId: results.insertId });
  });
};

exports.loginUser = (req, res) => {
  const { account_id, password } = req.body;
  if (!account_id || !password) {
    return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
  }

  User.findByAccountId(account_id, async (err, results) => {
    if (err) {
      return res.status(500).json({ error: '로그인에 실패했습니다.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: '아이디를 찾을 수 없습니다.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // JWT 토큰 생성 및 쿠키 설정
    const token = createToken({ userId: user.id });
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3일
    });

    res.json({ message: '로그인 성공' });
  });
};
