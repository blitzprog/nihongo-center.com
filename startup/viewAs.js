app.use((request, response, next) => {
	if(!request.user || !request.user.viewAs)
		return next()

	app.db.get('Users', request.user.viewAs).then(viewAs => {
		viewAs.viewedBy = request.user
		request.user = viewAs
		next()
	}).catch(next)
})