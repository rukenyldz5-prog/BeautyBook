const { validateRegisterInput, validateAppointmentInput } = require("../services/validators");

describe("validators", () => {
  test("register validator accepts valid input", () => {
    expect(() =>
      validateRegisterInput({ name: "Ruken", email: "ruken@test.com", password: "123456" })
    ).not.toThrow();
  });

  test("register validator rejects weak password", () => {
    expect(() =>
      validateRegisterInput({ name: "R", email: "ruken@test.com", password: "1" })
    ).toThrow();
  });

  test("appointment validator accepts valid input", () => {
    expect(() =>
      validateAppointmentInput({
        serviceName: "Saç Kesimi",
        employeeName: "Ayşe",
        appointmentDate: new Date().toISOString(),
        status: "planned"
      })
    ).not.toThrow();
  });

  test("appointment validator rejects invalid date", () => {
    expect(() =>
      validateAppointmentInput({
        serviceName: "Saç Kesimi",
        employeeName: "Ayşe",
        appointmentDate: "invalid",
        status: "planned"
      })
    ).toThrow();
  });
});
