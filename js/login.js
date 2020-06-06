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
    botao: '',
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
      dia: "Monday",
      disciplina: "RCD",
      hora_init: "14:00",
      hora_end: "16:00"
    },
    {
      dia: "Monday",
      disciplina: "TLC",
      hora_init: "16:00",
      hora_end: "18:00"
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
      dia: "Wednesday",
      disciplina: "ER",
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
    window.location.replace("login.html");
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
      if (i !== j) {
        if (arr[i] === arr[j]) {
          return false;
        }
      }
    }
  }
  return true;
}



//audio

//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
  console.log("recordButton clicked");

	/*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/

  var constraints = { audio: true, video: false }

  /*
    Disable the record button until we get a success or fail from getUserMedia() 
*/

  recordButton.disabled = true;
  stopButton.disabled = false;
  pauseButton.disabled = false

	/*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device
		*/
    audioContext = new AudioContext();

    //update the format 
    document.getElementById("formats").innerHTML = "Formato: 1 channel pcm @ " + audioContext.sampleRate / 1000 + "kHz"

    /*  assign to gumStream for later use  */
    gumStream = stream;

    /* use the stream */
    input = audioContext.createMediaStreamSource(stream);

		/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
    rec = new Recorder(input, { numChannels: 1 })

    //start the recording process
    rec.record()

    console.log("Recording started");

  }).catch(function (err) {
    //enable the record button if getUserMedia() fails
    recordButton.disabled = false;
    stopButton.disabled = true;
    pauseButton.disabled = true
  });
}

function pauseRecording() {
  console.log("pauseButton clicked rec.recording=", rec.recording);
  if (rec.recording) {
    //pause
    rec.stop();
    pauseButton.innerHTML = "Resume";
  } else {
    //resume
    rec.record()
    pauseButton.innerHTML = "Pause";

  }
}

function stopRecording() {
  console.log("stopButton clicked");

  //disable the stop button, enable the record too allow for new recordings
  stopButton.disabled = true;
  recordButton.disabled = false;
  pauseButton.disabled = true;

  //reset button just in case the recording is stopped while paused
  pauseButton.innerHTML = "Pause";

  //tell the recorder to stop the recording
  rec.stop();

  //stop microphone access
  gumStream.getAudioTracks()[0].stop();

  //create the wav blob and pass it on to createDownloadLink
  rec.exportWAV(createDownloadLink);
}

var voiceNotes = 0;

function createDownloadLink(blob) {

  var url = URL.createObjectURL(blob);
  var au = document.createElement('audio');
  var li = document.createElement('li');
  var link = document.createElement('a');
  var input = document.createElement('input');
  input.setAttribute("type", "hidden");
  input.setAttribute("id", "voiceNote" + voiceNotes);
  input.setAttribute("name", "voiceNote" + voiceNotes);

  //name of .wav file to use during upload and download (without extendion)
  var filename = "Comentario" + voiceNotes;

  //add controls to the <audio> element
  au.controls = true;
  au.src = url;

  //save to disk link
  link.href = url;
  link.download = filename + ".wav"; //download forces the browser to donwload the file using the  filename
  link.innerHTML = "Save to disk";

  //add the hidden input to send audio through mail to li
  li.appendChild(input);

  //add the new audio element to li
  li.appendChild(au);

  //add the filename to the li
  li.appendChild(document.createTextNode(filename + ".wav "))

  //add the save to disk link to li
  li.appendChild(link);

  //upload link
  var upload = document.createElement('a');
  upload.href = "#";
  upload.innerHTML = "Upload";
  upload.addEventListener("click", function (event) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
      if (this.readyState === 4) {
        console.log("Server returned: ", e.target.responseText);
      }
    };
    var fd = new FormData();
    fd.append("audio_data", blob, filename);
    xhr.open("POST", "upload.php", true);
    xhr.send(fd);
  })
  li.appendChild(document.createTextNode(" "))//add a space in between
  li.appendChild(upload)//add the upload link to li

  //add the li element to the ol
  recordingsList.appendChild(li);
  recordingsList.appendChild(input);
  //recordingsList.appendChild(input.attr('type', 'hidden').attr('id', "recordN" + voiceNotes + 1));
  $("#voiceNote" + voiceNotes).val(url);
  voiceNotes = parseInt(voiceNotes, 10) + 1;
}



//
var SpeechRecognition = window.webkitSpeechRecognition;

var recognition = new SpeechRecognition();

var Textbox = $('#textbox');
var instructions = $('instructions');

var Content = '';

recognition.continuous = true;

recognition.onresult = function (event) {

  var current = event.resultIndex;

  var transcript = event.results[current][0].transcript;

  Content += transcript;
  Textbox.val(Content);

};

recognition.onstart = function () {
  instructions.text('Voice recognition is ON.');
}

recognition.onspeechend = function () {
  instructions.text('No activity.');
}

recognition.onerror = function (event) {
  if (event.error == 'no-speech') {
    instructions.text('Try again.');
  }
}


$('#start-btn').on('click', function (e) {
  if (Content.length) {
    Content += ' ';
  }
  recognition.start();
});

$('#stop-btn').on('click', function (e) {
  if (Content.length) {
    Content += ' ';
  }
  recognition.stop();
});

Textbox.on('input', function () {
  Content = $(this).val();
})