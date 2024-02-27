import fetchData from "./server_routes.js";

async function postRegister(data) {
    const response = await fetchData.methods.fetchData('register', data);
    return response.status;
}

test("Returns response from server", async () => {
    const data = {
        firstName: "John",
        middleName: "",
        lastName: "Doe",
        email: "johndoe@doe.com",
        password: "123456",
        birthDay: "1990-08-16",
        PlaceOfResidence: "Vhol"
    }
    expect(postRegister(data)).resolves.toBe(200);
});

test("Returns response from server", async () => {
    const data = {
        firstName: "John",
        middleName: "",
        lastName: "Doe",
        email: "johndoe@doe.com",
        password: "123456",
        birthDay: "1990-08-16",
        PlaceOfResidence: "Vhol"
    }
    expect(postRegister(data)).resolves.toBe(200);
});


module.exports = postRegister;

