const socket = io('/');
$('#chat').hide();
socket.on('DANH_SACH_ONLINE', (arrUserInfo) => {
	$('#chat').show();
	$('#signup').hide();
	arrUserInfo.forEach((user) => {
		const { username, id } = user;
		$('#ulUsers').append(`<li id="${id}">${username}</li>`);
	});
	socket.on('CO_NGUOI_DUNG_MOI', (user) => {
		const { username, id } = user;
		$('#ulUsers').append(`<li id="${id}">${username}</li>`);
	});
	socket.on('AI_DO_NGAT_KET_NOI', (peerId) => {
		$(`#${peerId}`).remove();
	});
});
socket.on('DANG_KY_THAT_BAI', () => alert('Vui long chon username khac'));
function openStream() {
	const config = { audio: false, video: true };
	return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag, stream) {
	const video = document.getElementById(idVideoTag);
	video.srcObject = stream;
	video.play();
}
const peer = new Peer();
peer.on('open', (id) => {
	$('#my-peer').append(id);
	$('#btnSignup').click(() => {
		const username = $('#txtUsername').val();
		socket.emit('NGUOI_DUNG_DANG_KY', { username, id });
	});
});
$('#btnCall').click(() => {
	const id = $('#remoteId').val();
	openStream().then((stream) => {
		playStream('localStream', stream);
		const call = peer.call(id, stream);
		call.on('stream', (remoteStream) =>
			playStream('remoteStream', remoteStream),
		);
	});
});
peer.on('call', (call) => {
	openStream().then((stream) => {
		call.answer(stream);
		playStream('localStream', stream);
		call.on('stream', (remoteStream) =>
			playStream('remoteStream', remoteStream),
		);
	});
});
$('#ulUsers').on('click', 'li', function () {
	const id = $(this).attr('id');
	openStream().then((stream) => {
		playStream('localStream', stream);
		const call = peer.call(id, stream);
		call.on('stream', (remoteStream) =>
			playStream('remoteStream', remoteStream),
		);
	});
});
