const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			isAdmin: false,
			isLogged: false,
			isProfessor: false,
			token: "",
			user: {},
			profile: {},
			professors: [],
			currentProfessor: {},
			parents: [],
			students: [],
			notifications: [], // agregar al login y logout
			globalNotifications: [] // agregar al login y logout
			// Falta mas 
		},
		actions: { 
			login: async (email, password) => {
				console.log(email, password);
				const opt = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ email: email, password: password }),
				}
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/login", opt)
					const data = await resp.json()
					console.log(data)
					setStore({ 
						isLogged: true,
						user: data.results.user,
						profile: data.results.profile,
						token: data.access_token,
						isProfessor: data.results.user.is_professor
					});
					if (data.results.profile.is_admin) {
						setStore({
							isAdmin: data.results.profile.is_admin,
						})
					}
					console.log(getStore().user)

					localStorage.setItem('token', data.access_token) 
					localStorage.setItem('user', JSON.stringify(data.results.user)) 
					localStorage.setItem('profile', JSON.stringify(data.results.profile)) 
					return data
				} catch (error) {
					console.error(error);
					return false
				}
			},
			isLogged: () => {
				if(localStorage.getItem('token')){
					setStore({
						isLogged: true,
						user: localStorage.getItem('user'),
						profile: localStorage.getItem('profile')
					})
					setStore({isProfessor: getStore().user.is_professor})
					if (getStore().profile.is_admin) {
						setStore({isAdmin: getStore().profile.is_admin})
					}
				}
				else {
					setStore({
						isLogged: false
					})
				}
			},
			logOut: () => {
				setStore({
					isLogged: false,
					user: {},
					profile: {},
					isProfessor: false,
					isAdmin: false
				});
				localStorage.clear();
				console.log(localStorage);
			},
			getProfessors: async () => {
				const store = getStore();
				const url = process.env.BACKEND_URL + 'api/professors';
				const options = { 
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						'Authorization': "Bearer " + localStorage.getItem("token")
					}};
				const response = await fetch(url, options);
				if (response.ok) {
					const data = await response.json();
					console.log({ 'professors': data.professors });
					setStore({ professors: data.professors });
					// localStorage.setItem("professors", JSON.stringify(data.professors));
				} else {
					console.log('Error: ', response.status, response.statusText)
				}
			},
			getParents: async () => {
				const store = getStore();
				const url = process.env.BACKEND_URL + 'api/parents';
				const options = { 
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						'Authorization': "Bearer " + localStorage.getItem("token")
					}};
				const response = await fetch(url, options);
				if (response.ok) {
					const data = await response.json();
					console.log({ 'parents': data.parents });
					setStore({ parents: data.parents });
					// localStorage.setItem("parents", JSON.stringify(data.parents));
				} else {
					console.log('Error: ', response.status, response.statusText)
				}
			},
			getStudents: async () => {
				const store = getStore();
				const url = process.env.BACKEND_URL + 'api/students';
				const options = { 
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						'Authorization': "Bearer " + localStorage.getItem("token")
				} };
				const response = await fetch(url, options);
				if (response.ok) {
					const data = await response.json();
					console.log({ 'students': data.students });
					setStore({ students: data.students });
					// localStorage.setItem("students", JSON.stringify(data.students));
				} else {
					console.log('Error: ', response.status, response.statusText)
				}
			},
			createProfessor: async (newProfessor) => {
				const store = getStore();

				const url = process.env.BACKEND_URL + 'api/professors';
				const options = {
					method: 'POST',
					headers: {
						'Authorization': "Bearer " + localStorage.getItem("token")
					},
					body: JSON.stringify(newProfessor)
				}
				const response = await fetch(url, options);
				if (response.ok) {
					console.log(response);
					const data = await response.json();
					console.log({ "professors": data });
					getActions().getProfessors();
					// setStore({ "professors": [...store.professors, data] })
				} else {
					console.log('Error: ', response.status, response.statusText)
				}
			},
			updateProfessor: async (id, editedProfessor) => {
				const store = getStore();
				const base_url = process.env.BACKEND_URL + 'api/professors/' + id;
				const options = {
					method: 'PUT',
					headers: { 
						'Content-Type': 'application/json',
						'Authorization': "Bearer " + localStorage.getItem("token")
					},
					body: JSON.stringify(editedProfessor)
				};
				const response = await fetch(url, options);
				console.log(response);
				if (response.ok) {
					const data = await response.json();
					console.log({ "professors": data.professors });
					getActions().getProfessors();
				} else {
					console.log('Error: ', response.status, response.statusText)
				}
			},
			deleteProfessor: async (id) => {
				const store = getStore();
				const url = process.env.BACKEND_URL + 'api/professors/' + id;
				const options = { 
					method: 'DELETE',
					headers: { 
						'Content-Type': 'application/json',
						'Authorization': "Bearer " + localStorage.getItem("token")
					},
				};
				const response = await fetch(url, options);
				if (response.ok) {
					const data = await response.json();
        			getActions().getProfessors();
				} else {
					console.log('Error: ', response.status, response.statusText)
				}
			},
			getprofessorDetails: async (id) => {
				const store = getStore();
				const url = process.env.BACKEND_URL + 'api/professors/' + id;
				const options = { method: 'GET',
				headers: {
					"Content-Type": "application/json",
					'Authorization': "Bearer " + localStorage.getItem("token")
				}};
				const response = await fetch(url, options);
				if (response.ok) {
					const data = await response.json()
					console.log(data);
					setStore({ currentProfessor: data })
					// localStorage.setItem({'characters': JSON.stringify(data.results)})
				} else {
					console.log('Error: ', response.status, response.statusText)
				}
			},
			// exampleFunction: () => {
			// 	getActions().changeColor(0, "green");  // Use getActions() to call a function within a fuction
			// },
			// getMessage: async () => {
			// 	try {
			// 		// Fetching data from the backend
			// 		const response = await fetch(process.env.BACKEND_URL + "api/hello")
			// 		const data = await response.json()
			// 		setStore({message: data.message})
			// 		return data;  // Don't forget to return something, that is how the async resolves
			// 	} catch(error) {
			// 		console.log("Error loading message from backend", error)
			// 	}
			// },
			// changeColor: (index, color) => {
			// 	const store = getStore();  // Get the store
			// 	// We have to loop the entire demo array to look for the respective index and change its color
			// 	const demo = store.demo.map((element, i) => {
			// 		if (i === index) element.background = color;
			// 		return element;
			// 	});
			// 	setStore({demo: demo});  // Reset the global store
			// }
		}
	};
};


export default getState;