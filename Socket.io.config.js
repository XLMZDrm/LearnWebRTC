const arrUserInfo = [];
export function configIO(io) {
	io.on('connection', (socket) => {
		socket.on('NGUOI_DUNG_DANG_KY', (user) => {
			const isExist = arrUserInfo.some(
				(userInfo) => userInfo === user.username,
			);
			if (isExist) {
				return socket.emit('DANG_KY_THAT_BAI');
			}
			socket.peerId = user.id;
			arrUserInfo.push(user);
			socket.emit('DANH_SACH_ONLINE', arrUserInfo);
			socket.broadcast.emit('CO_NGUOI_DUNG_MOI', user);
		});
		socket.on('disconnect', () => {
			const index = arrUserInfo.findIndex(
				(user) => user.id === socket.peerId,
			);
			arrUserInfo.splice(index, 1);
			io.emit('AI_DO_NGAT_KET_NOI', socket.peerId);
		});
	});
}
