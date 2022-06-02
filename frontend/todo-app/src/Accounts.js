import React from 'react';
import './App.css';


class Accounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accountsList: [],
            activeItem: {
                id: null,
                username: '',
                email: '',
                password: '',
            },
            editing: false,
        }
        this.fetchUsers = this.fetchUsers.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getCookie = this.getCookie.bind(this)
        this.startEdit = this.startEdit.bind(this)
        this.deleteItem = this.deleteItem.bind(this)

    };

    getCookie(name) {
        document.getElementById('form').reset();
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    componentWillMount() {
        this.fetchUsers()
    }

    fetchUsers() {
        console.log('Fetching...')

        fetch('http://127.0.0.1:8000/api/accounts/user_list/')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    accountsList: data
                })
                console.log(data)
            })
    }

    handleChange(e) {
        if (e.target.name == "username"){
             this.state.activeItem.username = e.target.value
        }else if (e.target.name == "email"){
            this.state.activeItem.email = e.target.value
        }else if (e.target.name == "password"){
             this.state.activeItem.password = e.target.value
        }

        this.setState({
            activeItem: {
                ...this.state.activeItem
            }
        })
    }

    handleSubmit(e) {

        console.log(JSON.stringify(this.state.activeItem))
        e.preventDefault()
        console.log('ITEM:', this.state.activeItem)

        let csrftoken = this.getCookie('csrftoken')

        let url = 'http://127.0.0.1:8000/api/accounts/user_create/'

        if (this.state.editing == true) {
            url = `http://127.0.0.1:8000/api/accounts/user_update/${this.state.activeItem.id}/`
            this.setState({
                editing: false
            })
        }



        console.log(JSON.stringify(this.state.activeItem))

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(this.state.activeItem)
        }).then((response) => {
            this.fetchUsers()
            this.setState({
                activeItem: {
                    id: null,
                    username: '',
                    email: '',
                    password: '',
                }
            })
        }).catch(function (error) {
            console.log('ERROR:', error)
        })

    }

    startEdit(user) {
        console.log(user)
        this.setState({
            activeItem: user,
            editing: true,
        })
    }


    deleteItem(user) {
        let csrftoken = this.getCookie('csrftoken')

        fetch(`http://127.0.0.1:8000/api/accounts/user_delete/${user.id}/`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
        }).then((response) => {

            this.fetchUsers()
        })
    }

    render() {
        let users = this.state.accountsList
        let self = this
        return (
            <div className="container">
                <div id="task-container">
                    <div id="form-wrapper">
                        <form onSubmit={this.handleSubmit} id="form">
                            <div className="flex-wrapper">
                                <div style={{flex: 6}}>
                                    <input onChange={this.handleChange} className="form-control" id="title"
                                           value={this.state.activeItem.username}
                                           type="text" name="username"
                                           placeholder="Username"/>
                                    <br/>
                                    <input onChange={this.handleChange} className="form-control" id="email"
                                           value={this.state.activeItem.email}
                                           type="email" name="email"
                                           placeholder="Email"/>
                                    <br/>
                                    <input onChange={this.handleChange} className="form-control" id="password"
                                           value={this.state.activeItem.password}
                                           type="password" name="password"
                                           placeholder="Password"/>
                                    <br/>
                                        <input id="submit" className="btn btn-warning" type="submit" name="Add"/>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div id="list-wrapper">
                        {users.map(function (user, index) {
                            return (
                                <div key={index} className="user-wrapper flex-wrapper">
                                    <div style={{flex: 7}}>
                                           {user.username} ({user.email})
                                    </div>

                                    <div style={{flex: 1}}>
                                        <button onClick={() => self.startEdit(user)}
                                                className="btn btn-sm btn-outline-info">Edit
                                        </button>
                                    </div>

                                    <div style={{flex: 1}}>
                                        <button onClick={() => self.deleteItem(user)}
                                                className="btn btn-sm btn-outline-dark delete">-
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}


export default Accounts;