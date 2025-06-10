# MyFinance

# Sistema Pessoal de Controle Financeiro

📌 Sobre o Projeto

O MyFinance é uma aplicação desenvolvida para auxiliar usuários no gerenciamento de suas finanças pessoais. O sistema permite o cadastro de receitas e despesas, categorização de transações e geração de relatórios financeiros.

Tecnologias Utilizadas

Linguagem de programção: JavaScript
Linguagem de marcação: HTML
Estilização: CSS

Arquitetura: Camadas (Layers)

Banco de Dados: Firebase

# Como utilizar

Para utilizar nosso aplicativo é preciso criar um novo banco de dados no firebase.

1. Para isso deve-se entrar em: firebase.google.com logar com sua conta google.

2. Após logar devemos ir ao console firebase criar um novo projeto.

3. Escolha um nome para seu projeto, *nas próximas páginas desative o gemini e o google analytics*.

4. Entre em seu projeto vá em criação no menu esquerdo, selecione Firestore Database.

5. Crie um banco de dados no modo de teste.

6. Após a criação do banco de dados, vá ao menu criação novamente e selecione Authentication.

7. Depois de iniciar o Authentication selecione o método de login como: E-mail/senha, *não ative login sem senha*.

8. Ainda no menu Authentication vá em configurações, depois domínios autorizados, clique em Adicionar domínio, e adicione o domínio: gmail.com.

9. Através do menu do lado esquerdo, volte até Visão geral do projeto.

10. Na tela home, selecione o app Web para adiciona-lo ao seu projeto.

11. Escolha um nome e *não selecione o Firebase Hosting*.

12. Logo após registrar o app, ele irá abrir um menu para configurar o firebase, como já fizemos esses passos, será preciso apenas copiar o conteúdo da const firebaseConfig.

13. Depois de copiar os dados necessários, feche o menu de registro de app.

14. Abra o projeto e no caminho MyFinance/js/app.js cole as inforamações copiadas para dentro de initializeApp.
    Dessa forma deverá ser alterado apenas as informações de apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId.

15. Caso não tenha copiado as informações necessárias, podemos acessa-lás novamente clicando em app na tela home do console firebase.

16. Logo após vá na engrenagem de configuração e as informações necessárias estrão lá para uso.

# Considerações

Vale ressaltar que o projeto é apenas para testes e estudo acadêmico, por tanto não é recomendável seu uso em produção.
