# GoStack: Step-by-Step

Inicializar o projeto node dentro do diretório backend/

```yarn init -y```

Abrir o projeto no editor de texto preferido.

Criar o diretório src/ e o arquivo index.js dentro dele.

Adicionar a dependência express:
```yarn add express```

O express é um microframework, ou seja, um conjunto de ferramentas que dão a possibilidade de incluir na aplicação as rotas e os midlewares.


## Hello World com Node

Adicione este pedaço de código no arquivo backend/src/index.js

```
const express = require('express');

const app = express();

app.get('/projects', (request, response) => {
  return response.send('Hello GoStack!');
});

app.listen(3333);
```

Executar o código utilizando:

```node backend/src/index.js```

Instalar o nodemon:
```yarn add nodemon```

Para usá-lo, basta executar ```yarn nodemon backend/src/index.js```

Outra maneira que será adotada é a de adicionar um script ao arquivo backend/package.json.

```
...
"license": "MIT",
  "scripts": {
    "dev": "nodemon"
  },
  "dependencies"
  ...
```

É possível adicionar uma mensagem customizada toda vez que o nosso backend iniciar. Por exemplo:

```
app.listen(3333, () => {
  console.log('Back-end started!')
});
```

Como resultado:

```
jeff@jeff-VM:~/workarea/conceitos-dev/backend$ yarn dev
yarn dev
yarn run v1.22.4
$ nodemon
[nodemon] 2.0.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node src/index.js`
Back-end started!
```

## Métodos HTTP:

* GET: Buscar informações do back-end;
* POST: Criar uma informação no back-end;
* PUT/PATCH: Alterar uma informação no back-end;
* DELETE: Excluir uma informação no back-end.

Obs.:

**PUT** - _Alterar todos os dados ao mesmo tempo de um recurso._

**PATCH** - _Alterar dados específicos do recurso._

Configurar o Insomnia para acessar as rotas criadas e criar o ambiente de desenvolvimento (dev) com a "base_url": "http://localhost:3333"

## Tipos de Parâmetros

* _Query Params_: principalmente para Filtros e Paginação;
* _Route Params_: identificar recursos quando for atualizar ou deletar;
* _Request Body_: é o corpo da requisição usado para colocar o conteúdo na hora de criar ou editar um recurso (JSON).

É possível pegar os query params através do método get usando o parâmetro request.query.

```
app.get('/projects', (request, response) => {
  const query = request.query;

  console.log(query);
  return response.json([
    'Projeto 1',
    'Projeto 2',
  ]);
});
```

Como resultado, o terminal apresenta:

```
[nodemon] starting `node src/index.js`
Back-end started!
{ title: 'React', owner: 'Jefferson' }
```

Os query params podem ser extraídos aplicando a técnica de destructuring:
```  const { title, owner } = request.query;```

Para criar ou editar os recursos, podemos usar os métodos POST ou PUT/PATCH e as informações vindas do cliente podem ser acessadas pelo corpo da requisição.

No Insomnia basta criar o corpo da requisição no formato JSON e enviar:

```
{
	"title": "Aplicativo React Native",
	"owner": "Jefferson Cândido"
}
```

Para acessar esses dados, basta utilizar o parâmetro request.body dentro do método POST implementado:

```
app.post('/projects', (request, response) => {
  const body = request.body;

  console.log(body);
  return response.json([
    'Projeto 1',
    'Projeto 2',
    'Projeto 3'
  ]);
});
```

Até o momento, o log que aparece no terminal é de um dado não definido (_undefined_), porque o express por padrão não está definido para entender a serialização de dados em JSON.

```
[nodemon] starting `node src/index.js`
Back-end started!
undefined
```
 Então, isso deve ser informado ao express antes da configuração das rotas da aplicação.
 ```
app.use(express.json());
 ```
 Assim, os dados podem ser analisados:
 ```
 [nodemon] starting `node src/index.js`
Back-end started!
{ title: 'Aplicativo React Native', owner: 'Jefferson Cândido' }
```

## Aplicação Funcional

Inciar o desenvolvimento da API sem banco de dados, apenas armazenando em um array na memória da máquina. 

```
const projects = [];
```

Utilizar esse array dentro dos métodos para acesso aos recursos.

Instalar a dependência uuidv4
```yarn add uuidv4```

E importar a função uuid dessa dependência:
```
const { uuid } = require('uuidv4');
```

Dentro do POST projects, configurar da seguinte maneira:

```
app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);
  
  return response.json(project);
});
```

Cada projeto novo criado, receberá um identificador único (uuid), o título e o nome do criador. Depois o projeto é adicionado ao final do array de projetos.

Testando no Insomnia, é possível receber uma saída semelhante para o POST create:

```
{
  "id": "060b2711-285c-4a85-90c4-00ba1e80bc67",
  "title": "Aplicativo React Native",
  "owner": "Jefferson Cândido"
}
```

Agora para o método put, vamos percorrer o array de projetos e procurar pela posição em que se encontra o projeto que queremos alterar.

```
app.put('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found.'})
  }

  return response.json([
    'Projeto 4',
    'Projeto 2',
    'Projeto 3'
  ]);
});
```

Note o uso da função ```status(400)``` para evidenciar a necessidade de informar o status de erro no retorno à requisição (Bad Request).

```PUT: {{ base_url  }}/projects/1``` - (Rota com id inexistente)

```
{
  "error": "Project not found."
}
```

A partir de agora, basta utilizar os dados contidos no corpo da requisição (title, owner) para atualizar os dados de um dos projetos. Após isso, basta montar o objeto do projeto e atribuí-lo à posição encontrada no vetor de projetos.
```
app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found.'})
  }

  const project = {
    id,
    title,
    owner
  };

  projects[projectIndex] = project;

  return response.json(project);
});
```

Para o teste no Insomnia, basta criar um projeto, pegar o seu id e utilizá-lo para o processo de atualização.

POST: Create.

```
{
  "id": "0180aacc-0242-4de7-8385-1cd2d24d0405",
  "title": "Aplicativo React Native",
  "owner": "Jefferson Cândido"
}
```

PUT: Update.
```
{
  "id": "0180aacc-0242-4de7-8385-1cd2d24d0405",
  "title": "Aplicativo Móvel",
  "owner": "Jefferson Cândido"
}
```

O método DELETE pode ser escrito de forma semelhante ao PUT. Para exclusão do projeto do array, basta usar a função splice(). A resposta retornada ao cliente deve ser customizada com Status 204 (No Content) e assim a função send() aninhada para que o retorno seja sem conteúdo.

```
app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found.'})
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});
```

Por fim, vamos aplicar um filtro no método GET, filtrando pelos _Query Params_.

```
app.get('/projects', (request, response) => {
  const { title } = request.query;

  const results = title
  ? projects.filter(project => project.title.includes(title))
  : projects;
  return response.json(results);
});
```

## Middlewares

O middleware é um interceptador de requisições que pode interromper totalmente a requisição ou alterar dados da requisição. Seu formato é uma função que recebe uma requisição e uma resposta como parâmetro. O middleware deve ser utilizado quando algum trecho de código deve ser disparado de forma automática em diferentes requisições. O middleware pode ser utilizado como um sniffer na aplicação.

```
function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);
}

app.use(logRequests)
```
No terminal:
```
[nodemon] starting `node src/index.js`
Back-end started!
[GET] /projects/?title=Vue
```
Nesse formato, ao bater um GET na applicação, o middleware interromperia a requisição e o Insomnia ficaria aguardando o próximo passo (que não foi chamado).
Então, basta chamar o próximo middleware aplicando o ```return next()``` ao final da função _logRequests_.

Após isso, vemos o nosso middleware em ação nos retornando os logs das requisições que fizemos.

```
[nodemon] starting `node src/index.js`
Back-end started!
[GET] /projects/?title=Vue
[POST] /projects/
[PUT] /projects/6a90a29f-a5bf-426d-94e3-ed17dfd1236c
[DELETE] /projects/6a90a29f-a5bf-426d-94e3-ed17dfd1236c
[GET] /projects/?title=Vue
```
Para ficar mais clara a sequência de execução, colocar os console.log's como dispostos no trecho abaixo.

```
function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log('1');
  console.time(logLabel);

  next();

  console.log('2');
  console.timeEnd(logLabel);
}

app.use(logRequests)

app.get('/projects', (request, response) => {
  console.log('3');
  const { title } = request.query;

  const results = title
  ? projects.filter(project => project.title.includes(title))
  : projects;
  return response.json(results);
});
```

Ao realizar uma requisição GET essa é a saída:

```
[nodemon] starting `node src/index.js`
Back-end started!
1
3
2
[GET] /projects/?title=Vue: 4.220ms
```

Vamos agora implementar um middleware que vai ser utilizado para verificar se o ID que é passado na rotas rotas PUT e DELETE são válidos.
Para isso, basta importar a função isUuid(), do pacote uuid. O ID que é passado nos parâmetros da requisição é então validado na função isUuid().

Após isso basta sinalizar que esse middleware será usado nos métodos que chamam rotas do tipo '/projects/:id'.

```
function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID.' })
  }

  return next();
}

app.use(logRequests)
app.use('/projects/:id', validateProjectId);
```