# 베이스 이미지 선택
FROM node:22

# 앱 디렉토리 생성
WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 앱 소스 복사
COPY . .

# 서버 포트 설정
EXPOSE 3000

# 앱 실행
CMD ["npm", "start"]