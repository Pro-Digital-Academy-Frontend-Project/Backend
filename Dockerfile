# 베이스 이미지 선택
FROM node:22 AS build

# 앱 디렉토리 생성
WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치 (캐싱을 활용하기 위해 build 단계에서 먼저 설치)
RUN npm install

# 앱 소스 복사
COPY . .

# 실행 단계로 전환
FROM node:22

# 앱 디렉토리 생성
WORKDIR /app

# build 단계에서 설치된 node_modules와 소스 코드 복사
COPY --from=build /app /app

# 서버 포트 설정
EXPOSE 3000

# 앱 실행
CMD ["npm", "start"]