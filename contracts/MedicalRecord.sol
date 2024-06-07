
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MedicalRecord {
    struct Record {
        string ipfsHash;
        address doctor;
        uint timestamp;
    }

    struct Appointment {
        address patient;
        address doctor;
        uint timestamp;
        bool confirmed;
    }

    mapping(address => Record[]) public patientRecords;
    mapping(address => bool) public doctors;
    Appointment[] public appointments;

    event RecordAdded(address indexed patient, string ipfsHash, address indexed doctor, uint timestamp);
    event AppointmentRequested(address indexed patient, address indexed doctor, uint timestamp);
    event AppointmentConfirmed(uint indexed appointmentId);

    modifier onlyDoctor() {
        require(doctors[msg.sender] == true, "Only doctors can perform this action");
        _;
    }

    function addDoctor(address _doctor) public {
        doctors[_doctor] = true;
    }

    function addRecord(address _patient, string memory _ipfsHash) public onlyDoctor {
        patientRecords[_patient].push(Record(_ipfsHash, msg.sender, block.timestamp));
        emit RecordAdded(_patient, _ipfsHash, msg.sender, block.timestamp);
    }

    function getRecords(address _patient) public view returns (Record[] memory) {
        return patientRecords[_patient];
    }

    function requestAppointment(address _doctor, uint _timestamp) public {
        require(doctors[_doctor], "Invalid doctor address");
        appointments.push(Appointment(msg.sender, _doctor, _timestamp, false));
        emit AppointmentRequested(msg.sender, _doctor, _timestamp);
    }

    function confirmAppointment(uint _appointmentId) public onlyDoctor {
        Appointment storage appointment = appointments[_appointmentId];
        require(appointment.doctor == msg.sender, "Only the assigned doctor can confirm this appointment");
        appointment.confirmed = true;
        emit AppointmentConfirmed(_appointmentId);
    }

    function getAppointments() public view returns (Appointment[] memory) {
        return appointments;
    }
}
