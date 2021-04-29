const socket = io()
let SocketConnections = []

const renderClients = (clientList = SocketConnections, template) => {

    document.getElementById("list_users").innerHTML = ""

    clientList.forEach(client => {

        const render = Mustache.render(template, {
            email: client.user.email,
            id: client.socket_id
        })

        document.getElementById("list_users").innerHTML += render
    });
}

socket.on("admin_list_all_users", (connections) => {
    SocketConnections = connections

    document.getElementById("list_users").innerHTML = ""

    let template = document.getElementById("template").innerHTML

    renderClients(connections, template)
})

const call = (id) => {

    const connection = SocketConnections.find(connection => connection.socket_id === id)
    console.log(connection)

    let template = document.getElementById("admin_template").innerHTML

    const render = Mustache.render(template, {
        email: connection.user.email,
        id: connection.user_id
    })

    document.getElementById("supports").innerHTML += render

    const params = {
        user_id: connection.user_id
    }

    socket.emit("admin_list_user_messages", params, messages => {

        const divMessage = document.getElementById(`allMessages${params.user_id}`)


        messages.forEach(message => {
            const createDiv = document.createElement("div")

            if (message.admin_id === null) {
                createDiv.className = "admin_message_client"

                createDiv.innerHTML = `<span>${connection.user.email}</span><span>${message.message}</span>`
                createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`
            } else {

                createDiv.className = "admin_message_admin"

                createDiv.innerHTML = `Atendente: <span>${message.message}</span>`
                createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`
            }

            divMessage.appendChild(createDiv)
        })

    })
}

const sendMessage = (id) => {

    const message = document.getElementById(`send_message_${id}`)

    const params = {
        message: (message.value).trim(),
        user_id: id
    }


    socket.emit("admin_send_message", params)

    const divMessage = document.getElementById(`allMessages${id}`)
    const createDiv = document.createElement("div")

    createDiv.className = "admin_message_admin"

    createDiv.innerHTML = `Atendente: <span>${params.message}</span>`
    createDiv.innerHTML += `<span class="admin_date">${dayjs().format("DD/MM/YYYY HH:mm:ss")}</span>`

    divMessage.appendChild(createDiv)

    message.value = ""
}

socket.on("admin_receive_message", (data) => {
    const { message, socket_id, user_id } = data

    const connection = SocketConnections.find(connection => connection.socket_id = socket_id)
    console.log(`socket id: ${socket_id}`)
    console.log(`connection: ${user_id}`)
    console.log(`SocketConnections ${SocketConnections.map((values) => values)}`)

    const divMessage = document.getElementById(`allMessages${user_id}`)
    console.log(divMessage)

    const createDiv = document.createElement("div")

    createDiv.className = "admin_message_client"

    createDiv.innerHTML = `<span>${connection.user.email}</span><span>${message}</span>`
    createDiv.innerHTML += `<span class="admin_date">${dayjs().format("DD/MM/YYYY HH:mm:ss")}</span>`

    divMessage.appendChild(createDiv)
})