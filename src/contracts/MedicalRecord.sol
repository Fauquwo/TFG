// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecord {
    // Estructura para almacenar registros médicos con hash de IPFS, dirección del doctor y marca de tiempo
    struct Record {
        string ipfsHash;
        address doctor;
        uint timestamp;
    }

    // Estructura para almacenar detalles de citas incluyendo paciente, doctor, marca de tiempo y estado de confirmación
    struct Appointment {
        address patient;
        address doctor;
        uint timestamp;
        bool confirmed;
    }

    // Mapeo para almacenar matrices de registros médicos para cada paciente
    mapping(address => Record[]) public patientRecords;
    // Mapeo para almacenar la lista de doctores aprobados
    mapping(address => bool) public doctors;
    mapping(address => bool) public patients;
    // Matriz para almacenar todas las solicitudes de citas
    Appointment[] public appointments;

    // Eventos para registrar acciones
    event RecordAdded(address indexed patient, string ipfsHash, address indexed doctor, uint timestamp);
    event AppointmentRequested(address indexed patient, address indexed doctor, uint timestamp);
    event AppointmentConfirmed(uint indexed appointmentId);

    // Modificador para restringir el acceso solo a doctores aprobados
    modifier onlyDoctor() {
        require(doctors[msg.sender] == true, "Only doctors can perform this action");
        _;
    }
    
    modifier onlyPatient() {
        require(patients[msg.sender] == true, "Only patients can perform this action");
        _;
    }
    // Función para agregar un nuevo doctor a la lista de aprobados
    function addDoctor(address _doctor) public {
        doctors[_doctor] = true;
    }
    
    function addPatient(address _patient) public {
        patients[_patient] = true;
    }
    // Función para que los doctores agreguen un registro médico para un paciente
    function addRecord(address _patient, string memory _ipfsHash) public onlyDoctor {
        patientRecords[_patient].push(Record(_ipfsHash, msg.sender, block.timestamp));
        emit RecordAdded(_patient, _ipfsHash, msg.sender, block.timestamp);
    }

    // Función para recuperar todos los registros médicos de un paciente
    function getRecords(address _patient) public view returns (Record[] memory) {
        return patientRecords[_patient];
    }

    // Función para que los pacientes soliciten una cita con un doctor
    function requestAppointment(address _doctor, uint _timestamp) public onlyPatient{
        require(doctors[_doctor], "Invalid doctor address");
        appointments.push(Appointment(msg.sender, _doctor, _timestamp, false));
        emit AppointmentRequested(msg.sender, _doctor, _timestamp);
    }

    // Función para que los doctores confirmen una cita
    function confirmAppointment(uint _appointmentId) public onlyDoctor {
        Appointment storage appointment = appointments[_appointmentId];
        require(appointment.doctor == msg.sender, "Only the assigned doctor can confirm this appointment");
        appointment.confirmed = true;
        emit AppointmentConfirmed(_appointmentId);
    }

    // Función para recuperar todas las citas
    function getAppointments() public view returns (Appointment[] memory) {
        return appointments;
    }
}
