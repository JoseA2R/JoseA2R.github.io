//scripts

//para usar o email inserido no login
function setTextoTop(s) {
  var e_mail = localStorage.getItem('e_mail');
  var texto = '';
  switch (s) {
    case 'aluno': texto = "Aluno, " + e_mail; break;
    case 'prof': texto = "Professor, " + e_mail; break;
    case 'tecnico': texto = "Técnico, " + e_mail; break;
    default: break;
  }
  //console.log(texto);
  if (!e_mail) {
    $("#nome_num_top").text("Utilizador não identificado!");
  }
  else {
    $("#nome_num_top").text(texto);
  }
}

//para nao permitir selecionar datas passadas
function setDatePickerMinDate() {
  var current_date_full = new Date();
  var twoDigitMonth = current_date_full.getMonth() + 1;
  var twoDigitDay = current_date_full.getDate();

  if (twoDigitMonth < 10) {
    twoDigitMonth = '0' + twoDigitMonth;
  }

  if (twoDigitDay < 10) {
    twoDigitDay = '0' + twoDigitDay;
  }
  var current_date_short = current_date_full.getFullYear() + "-" + twoDigitMonth + "-" + twoDigitDay;
  //console.log(current_date_short);
  $("#datePicker").attr('min', current_date_short);
}

function getNum(s) {
  //obtem o numero mecanografico a partir do email
  if (s === null) {
    return '';
  }
  else {
    return s.split('@')[0];
  }
}

//retorna um objeto representante de uma reserva individual
function newReservaInd() {
  var reserva = {
    tipo: '',
    user: '',
    sala: '',
    data: '',
    hora_init: '',
    hora_end: '',
    confirmada: ''
  }
  return reserva;
}

//retorna um objeto representante de uma reserva de grupo
function newReservaGrupo() {
  var reserva = {
    id: '',
    tipo: '',
    user: '', //aluno que realiza a reserva
    sala: '',
    data: '',
    hora_init: '',
    hora_end: '',
    confirmada: '',
    lista_confirmacoes: []  //lista dos colegas: [{numero, confirmada}, ...]
  }
  return reserva;
}

//retorna um objeto representante de uma notificação
function newNotification() {
  var notification = {
    user: '',
    tipo: '',
    descricao: '',
    id: ''
  }
  return notification;
}

//guarda a lista de reservas individuais
function saveListaReservasInd(lista) {
  var listaReservasInd = JSON.stringify(lista);
  localStorage.setItem('listaReservasInd', listaReservasInd);
  //console.log(JSON.parse(localStorage.getItem('listaReservasInd')));
}

//guarda a lista de reservas de grupo
function saveListaReservasGrupo(lista) {
  var listaReservasGrupo = JSON.stringify(lista);
  localStorage.setItem('listaReservasGrupo', listaReservasGrupo);
  //console.log(JSON.parse(localStorage.getItem('listaReservasGrupo')));
}

//guarda a lista das notificações
function saveListaNotifications(lista) {
  var listaNotifications = JSON.stringify(lista);
  localStorage.setItem('listaNotifications', listaNotifications);
  //console.log(JSON.parse(localStorage.getItem('listaNotifications')));
}

//carrega a lista de reservas individuais
function loadListaReservasInd() {
  var lista = localStorage.getItem('listaReservasInd');
  if (lista == null) {
    return [];
  }
  else {
    return JSON.parse(lista);
  }
}

//carrega a lista de reservas de groupo
function loadListaReservasGrupo() {
  var lista = localStorage.getItem('listaReservasGrupo');
  if (lista == null) {
    return [];
  }
  else {
    return JSON.parse(lista);
  }
}

//carrega a lista de todas as notificações
function loadListaNotifications() {
  var lista = localStorage.getItem('listaNotifications');
  if (lista == null) {
    return [];
  }
  else {
    return JSON.parse(lista);
  }
}

//recebe uma data e devolve o dia da semana
function getDayOfWeek(date) {
  var dayOfWeek = new Date(date).getDay();
  //console.log(dayOfWeek);
  return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
}

//horário apenas para simulaçao
function getHorario() {
  var horario = [
    {
      dia: "Monday",
      disciplina: "ER",
      hora_init: "09:00",
      hora_end: "11:00"
    },
    {
      dia: "Monday",
      disciplina: "RCD",
      hora_init: "11:00",
      hora_end: "13:00"
    },
    {
      dia: "Tuesday",
      disciplina: "HCI",
      hora_init: "09:00",
      hora_end: "11:00"
    },
    {
      dia: "Tuesday",
      disciplina: "TLC",
      hora_init: "11:00",
      hora_end: "13:00"
    },
    {
      dia: "Tuesday",
      disciplina: "ER",
      hora_init: "14:00",
      hora_end: "16:00"
    },
    {
      dia: "Tuesday",
      disciplina: "RCD",
      hora_init: "18:00",
      hora_end: "20:00"
    },
    {
      dia: "Wednesday",
      disciplina: "TLC",
      hora_init: "09:00",
      hora_end: "11:00"
    },
    {
      dia: "Wednesday",
      disciplina: "HCI",
      hora_init: "11:00",
      hora_end: "13:00"
    }
  ]

  return horario;
}

//verifica se um intervalo de tempo interseta com o horario de aulas
function intersetaHorario(hora_init, hora_end, data) {
  var horario = getHorario();
  var dayOfWeek = getDayOfWeek(data);
  for (var i = 0; i < horario.length; i++) {
    if (horario[i].dia === dayOfWeek) {
      if (hora_init >= horario[i].hora_init && hora_init < horario[i].hora_end) {
        //console.log("interseta com " + horario[i].disciplina);
        return true;
      }
      if (hora_end > horario[i].hora_init && hora_end <= horario[i].hora_end) {
        //console.log("interseta com " + horario[i].disciplina);
        return true;
      }
    }
  }

  //console.log("nao interseta");
  return false;
}

//verifica se uma reserva interseta com o fecho de uma sala
function intersetaFechoSala(reserva, fecho) {
  if (reserva.sala === fecho.sala && reserva.data === fecho.data) {
    if (reserva.hora_init >= fecho.hora_init && reserva.hora_init < fecho.hora_end) {
      return true;
    }
    if (reserva.hora_end > fecho.hora_init && reserva.hora_end <= fecho.hora_end) {
      return true;
    }
  }

  return false;
}

//verifica se um aluno tem reservas pendentes
function alunoTemReservasPendentes(num) {
  var listaReservasGrupo = loadListaReservasGrupo();
  if (listaReservasGrupo.length === 0) {
    return false;
  }
  else {
    for (var i = 0; i < listaReservasGrupo.length; i++) {
      for (var j = 0; j < listaReservasGrupo[i].lista_confirmacoes.length; j++) {
        if (listaReservasGrupo[i].lista_confirmacoes[j].num === num && listaReservasGrupo[i].lista_confirmacoes[j].confirmado === false) {
          return true;
        }
      }
    }
  }
  return false;
}

//verifica se um aluno tem reservas efetuadas
function temReservasEfetuadas(num) {
  var listaReservasInd = loadListaReservasInd();
  if (listaReservasInd.length === 0) {
    return false;
  }
  else {
    for (var i = 0; i < listaReservasInd.length; i++) {
      if (listaReservasInd[i].user === num) {
        return true;
      }
    }
  }
  return false;
}

//verifica se um aluno tem outras notificações
function temOutrasNotificacoes(num) {
  var listaNotifications = loadListaNotifications();
  if (listaNotifications.length === 0) {
    return false;
  }
  else {
    for (var i = 0; i < listaNotifications.length; i++) {
      if (listaNotifications[i].user === num) {
        return true;
      }
    }
  }
}

//devolve uma lista com as reservas pendentes de um aluno
function getReservasPendentes(num) {
  var lista_final = [];
  var listaReservasGrupo = loadListaReservasGrupo();
  for (var i = 0; i < listaReservasGrupo.length; i++) {
    for (var j = 0; j < listaReservasGrupo[i].lista_confirmacoes.length; j++) {
      if (listaReservasGrupo[i].lista_confirmacoes[j].num === num && listaReservasGrupo[i].lista_confirmacoes[j].confirmado == false) {
        lista_final.push(listaReservasGrupo[i]);
        break;
      }
    }
  }
  return lista_final;
}

//devolve uma lista com as reservas de um aluno
function getReservasEfetuadas(num) {
  var lista_final = [];
  var listaReservasInd = loadListaReservasInd();
  for (var i = 0; i < listaReservasInd.length; i++) {
    if (listaReservasInd[i].user === num) {
      lista_final.push(listaReservasInd[i]);
    }
  }
  return lista_final;
}

//devolve uma lista com as notificações de um aluno
function getNotifications(num) {
  var lista_final = [];
  var listaNotifications = loadListaNotifications();
  for (var i = 0; i < listaNotifications.length; i++) {
    if (listaNotifications[i].user === num) {
      lista_final.push(listaNotifications[i]);
    }
  }
  return lista_final;
}

//verifica se uma reserva de grupo ja recebeu todas as confirmações
function todasConfirmadas(id) {
  var listaReservasGrupo = loadListaReservasGrupo();
  for (var i = 0; i < listaReservasGrupo.length; i++) {
    if (listaReservasGrupo[i].id == id) {
      for (var j = 0; j < listaReservasGrupo[i].lista_confirmacoes.length; j++) {
        if (listaReservasGrupo[i].lista_confirmacoes[j].confirmado === false) {
          return false;
        }
      }
      break;
    }
  }
  return true;
}

//apos todas as confirmações, é eliminada a reserva de grupo
//e criadas reservas individuais para cada aluno
function finalizaReservaGrupo(id, tipo) {
  var listaReservasGrupo = loadListaReservasGrupo();
  var user, sala, hora_init, hora_end, data, grupo = [];

  //console.log(listaReservasGrupo);

  for (var i = 0; i < listaReservasGrupo.length; i++) {
    if (listaReservasGrupo[i].id == id) {
      user = listaReservasGrupo[i].user;
      sala = listaReservasGrupo[i].sala;
      data = listaReservasGrupo[i].data;
      hora_init = listaReservasGrupo[i].hora_init;
      hora_end = listaReservasGrupo[i].hora_end;

      grupo.push(user);
      for (var j = 0; j < listaReservasGrupo[i].lista_confirmacoes.length; j++) {
        grupo.push(listaReservasGrupo[i].lista_confirmacoes[j].num);
      }

      //console.log('grupo:');
      //console.log(grupo);

      var reserva = newReservaInd();
      reserva.tipo = tipo;
      reserva.sala = sala;
      reserva.data = data;
      reserva.hora_init = hora_init;
      reserva.hora_end = hora_end;
      reserva.confirmada = true;

      //console.log(reserva);

      for (var k = 0; k < grupo.length; k++) {
        reserva.user = grupo[k];

        //console.log('user:');
        //console.log(reserva.user);
        //console.log('reserva:');
        //console.log(reserva);
        listaReservasInd = loadListaReservasInd();
        //console.log(listaReservasInd);
        listaReservasInd.push(reserva);
        saveListaReservasInd(listaReservasInd);
      }

      //console.log('antes do splice:' + i);
      //console.log(listaReservasGrupo);
      listaReservasGrupo.splice(i, 1);
      //console.log('depois do splice:');
      //console.log(listaReservasGrupo);
      //console.log('---------------------------');

      saveListaReservasGrupo(listaReservasGrupo);
      //console.log('reservas individuais:');
      //console.log(loadListaReservasInd());
      console.log('reservas de grupo:');
      console.log(loadListaReservasGrupo());

      break;
    }
  }
}

//verifica se o utilizador fez login
function isLoggedOn() {
  if (localStorage.getItem('e_mail') == null) {
    return false;
  }

  return true;
}

//redireciona para a pagina de login caso nao tenha feito ainda
function redirectLogin() {
  if (!isLoggedOn()) {
    window.location.replace("index.html");
  }
}

//verifica se a hora de inicio é válida (i.e.: se ainda nao passou)
function horaValida(s_1) {
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();

  minutes += 30;
  hours = hours < 10 ? '0' + hours : hours;

  s_2 = hours + ":" + minutes;

  return s_1 > s_2;
}

//verifica se a data introduzida é a do proprio dia
function dataHoje(s) {
  var today = new Date();
  var day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
  var month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
  today = today.getFullYear() + "-" + month + "-" + day;

  return s === today;
}

//verifica se os valores de um array sao diferentes uns dos outros
//e diferentes de um outro valor nao pertencente ao array
function todosDiferentes(arr, val) {
  //verificar se o valor é diferente de todos os valores do array
  for (var i = 0; i < arr.length; i++) {
    if (val === arr[i]) {
      return false;
    }
  }

  //verificar se cada valor do array é diferente de todos os outros
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr.length; j++) {
      if (i !== j){
        if(arr[i] === arr[j]){
          return false;
        }
      }
    }
  }
  return true;
}