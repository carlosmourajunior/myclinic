# Use Node.js para o desenvolvimento
FROM node:20 AS development

WORKDIR /app

# Copie os arquivos de configuração
COPY package*.json ./

# Instale as dependências
RUN npm install

RUN npm install react-bootstrap

RUN npm install bootstrap

RUN npm install react-icons

RUN npm install react-big-calendar moment

# Copie o código-fonte do projeto
COPY . .

# Exponha a porta padrão de desenvolvimento do React
EXPOSE 3000

ENV NODE_OPTIONS=--openssl-legacy-provider

# Execute o React em modo de desenvolvimento
CMD ["npm", "start"]
