let socketAdmin = null
let emailUser = null
let socket = null

document.querySelector("#start_chat").addEventListener("click", (event) => {
    document.querySelector("#chat_help").style.display = "none";
    document.querySelector("#chat_in_support").style.display = "block";


    socket = io();

    let email = document.querySelector("#email").value;
    emailUser = email

    let title = document.querySelector("#txt_help").value;

    socket.on("connect", () => {
        const params = {
            email,
            message: title
        }

        console.log(params)
        socket.emit("client_access", params, (callback, errors) => {
            if (errors) {
                console.log(errors)
            } else {
                console.log(callback)
            }
        })
    })

    socket.on("client_list_messages", messages => {

        let templateClient = document.getElementById("message-user-template").innerHTML;
        let templateAdmin = document.getElementById("admin-template").innerHTML;

        messages.forEach(message => {
            if (message.admin_id === null) {
                let renderTemplate = Mustache.render(templateClient, {
                    message: message.message,
                    email
                })

                document.getElementById("messages").innerHTML += renderTemplate;
            } else {
                let renderTemplate = Mustache.render(templateAdmin, {
                    message_admin: message.message,
                })

                document.getElementById("messages").innerHTML += renderTemplate;
            }
        });
    })


    socket.on("admin_send_to_client", message => {
        socketAdmin = message.socket_id

        const templateAdmin = document.getElementById("admin-template").innerHTML

        const render = Mustache.render(templateAdmin, {
            message_admin: message.message
        })

        document.getElementById("messages").innerHTML += render
    })
});

document.querySelector("#send_message_button").addEventListener('click', (event) => {

    const text = document.getElementById("message_user").value

    const params = {
        message: text,
        socketAdmin
    }

    socket.emit("client_send_to_admin", params)

    const template = document.getElementById("message-user-template").innerHTML

    const render = Mustache.render(template, {
        message: text,
        email: emailUser
    })

    document.getElementById("messages").innerHTML += render
})