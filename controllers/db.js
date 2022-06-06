var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hms'
});

con.connect(function (err) {
    if (err) {
        throw err;
    }
});

module.exports.signup = function (username, email, password, status, callback) {
    con.query('SELECT email FROM users WHERE email = "' + email + '"',
        function (err, result) {
            if (result[0] == undefined) {
                var query = "INSERT INTO `users`(`username`,`email`,`password`,`email_status`) VALUES('" + username + "','" + email + "','" + password + "','" + status + "')";
                con.query(query, callback);
            } else {
                console.log("error");
            }
        });
}

module.exports.verify = function (username, email, token, callback) {
    var query = "INSERT INTO  `verify` (`username`, `email`, `token`) VALUES ('" + username + "','" + email + "','" + token + "')";
    con.query(query, callback);
}


module.exports.getuserid = function (email, callback) {
    var query = "SELECT * FROM `verify` WHERE email='" + email + "'";
    con.query(query, callback);
}

module.exports.matchtoken = function (id, token, callback) {
    var query = "SELECT * FROM `verify` WHERE token='" + token + "'";
    con.query(query, callback);
}

module.exports.checktoken = function ( token, callback) {
    var query = "SELECT * FROM `temp` WHERE token='" + token + "'";
    con.query(query, callback);
}

module.exports.updateverify = function (email, email_status, callback) {
    var query = "UPDATE `users` set `email_status` ='" + email_status + "'where email= '" + email + "'";
    con.query(query, callback);
}

module.exports.setpassword = function (id,pwDB,saltDB, callback) {
    var query = "UPDATE `users` set `password` ='" + pwDB + "',`salt`='" + saltDB +"'where id= '" + id + "'";
    con.query(query, callback);
}

module.exports.findOne = function (email, callback) {
    var query = "SELECT * FROM users WHERE email = '" + email + "'"
    con.query(query, callback);
}

module.exports.temp = function (id, email, token, callback) {
    var query = "INSERT INTO `temp`(`id`,`email`,`token`) VALUES('" + id + "','" + email + "','" + token + "')"
    con.query(query, callback);
}

module.exports.add_doctor = function (first_name, last_name, email, dob, gender, address, phone, image, department, biography, callback) {
    var query = "INSERT INTO `doctor`(`first_name`,`last_name`,`email`,`dob`,`gender`,`address`,`phone`,`image`,`department`,`biography`) VALUES('" + first_name + "','" + last_name + "','" + email + "','" + dob + "','" + gender + "','" + address + "','" + phone + "','" + image + "','" + department + "','" + biography + "')";
    con.query(query, callback);
}

module.exports.getAllDoc = function (callback) {
    var query = "SELECT * FROM doctor"
    con.query(query, callback);
}

module.exports.getDocbyId = function (id, callback) {
    var query = "SELECT * FROM doctor WHERE id = " + id;
    con.query(query, callback);
}

module.exports.edit_doctor = function (id, first_name, last_name, email, dob, gender, address, phone, department, callback) {
    var query = "UPDATE `doctor` SET `first_name`='" + first_name + "',`last_name`='" + last_name + "',`email`='" + email + "',`dob`='" + dob + "',`gender`='" + gender + "',`address`='" + address + "',`phone`='" + phone + "',`department`='" + department + "' WHERE id =" + id;
    con.query(query, callback);
}

module.exports.deleteDoc = function (id, callback) {
    var query = "DELETE FROM doctor WHERE id = " + id
    con.query(query, callback);
}

module.exports.searchDoc = function (key, callback) {
    var query = 'SELECT * from doctor where first_name like "%' + key + '%"';
    con.query(query, callback);
}

module.exports.getAlldept = function (callback) {
    var query = "SELECT * FROM departments";
    con.query(query, callback);
}

module.exports.getEmpbyId = function (id, callback) {
    var query = "select * from employee where id =" + id;
    con.query(query, callback);
};

module.exports.postcomplain = function (message, name, email, subject, callback) {
    var query = "insert into complain (message,name,email,subject) values ('" + message + "','" + name + "','" + email + "','" + subject + "')";
    con.query(query, callback);
};

module.exports.getcomplain = function (callback) {
    var query = "select * from complain";
    con.query(query, callback);
};

module.exports.add_appointment = function (p_name, department, d_name, date, time, email, phone, callback) {
    var query = "insert into appointment (patient_name,department,doctor_name,date,time,email,phone) values ('" + p_name + "','" + department + "','" + d_name + "','" + date + "','" + time + "','" + email + "','" + phone + "')";
    con.query(query, callback);
};

module.exports.getallappointment = function (callback) {
    var query = "select * from appointment";
    con.query(query, callback);
};

module.exports.getAllLeave = function (callback) {
    var query = "Select * from leaves";
    con.query(query, callback);
};

module.exports.searchmed = function (key, callback) {
    var query = 'SELECT  *from store where name like "%' + key + '%"';
    con.query(query, callback);
};


module.exports.getappointmentbyid = function (id, callback) {
    var query = "select * from appointment where id=" + id;
    con.query(query, callback);
};

module.exports.editappointment = function (id, p_name, department, d_name, date, time, email, phone, callback) {
    var query = "update appointment set patient_name='" + p_name + "',department='" + department + "',doctor_name='" + d_name + "',date='" + date + "',time='" + time + "',email='" + email + "',phone='" + phone + "' where id=" + id;
    con.query(query, callback);
};

module.exports.deleteappointment = function (id, callback) {
    var query = "delete from appointment where id=" + id;
    con.query(query, callback);
};

module.exports.addMed = function (name, p_date, expire, e_date, price, quantity, callback) {
    var query = "Insert into `store` (name,p_date,expire,expire_end,price,quantity) values('" + name + "','" + p_date + "','" + expire + "','" + e_date + "','" + price + "','" + quantity + "')";
    con.query(query, callback);
};

module.exports.getMedbyId = function (id, callback) {
    var query = "select * from store where id=" + id;
    con.query(query, callback);
};

module.exports.editmed = function (id, name, p_date, expire, e_date, price, quantity, callback) {
    var query = "update store set name='" + name + "', p_date='" + p_date + "',expire='" + expire + "' ,expire_end='" + e_date + "',price='" + price + "',quantity='" + quantity + "' where id=" + id;
    con.query(query, callback);
};

module.exports.getallmed = function (callback) {
    var query = "select * from store";
    con.query(query, callback);
};

module.exports.add_dept = function (name, desc, callback) {
    var query = "insert into departments(department_name,department_desc) values ('" + name + "','" + desc + "')";
    con.query(query, callback);
};

module.exports.delete_department = function (id, callback) {
    var query = "delete from departments where id=" + id;
    con.query(query, callback);
};

module.exports.getdeptbyId = function (id, callback) {
    var query = "select * from departments where id=" + id;
    con.query(query, callback);
};

module.exports.edit_dept = function (id, name, desc, callback) {
    var query = "update departments set department_name='" + name + "',department_desc='" + desc + "' where id=" + id;
    con.query(query, callback);
};

module.exports.getuserdetails = function (username, callback) {
    var query = "select * from users where username='" + username + "'";
    con.query(query, callback);

};

module.exports.edit_profile = function (id, username, email, password,salt, callback) {
    var query = "update users set username ='" + username + "', email = '" + email + "',password='" + password + "',salt='" + salt +"' where id=" + id;
    con.query(query, callback);
};

module.exports.getAllemployee = function (callback) {
    var query = "select * from employee";
    con.query(query, callback);
};

module.exports.deletemed = function (id, callback) {
    var query = "delete from store where id=" + id;
    con.query(query, callback);
};

module.exports.add_employee = function (
    name,
    email,
    contact,
    join_date,
    role,
    salary,
    callback
) {
    var query =
        "Insert into `employee` (`name`,`email`,`contact`,`join_date`,`role`,`salary`) values ('" +
        name +
        "','" +
        email +
        "','" +
        contact +
        "','" +
        join_date +
        "','" +
        role +
        "','" +
        salary +
        "')";
    con.query(query, callback);

};

module.exports.deleteEmp = function (id, callback) {
    var query = "delete from employee where id=" + id;
    con.query(query, callback);
};

module.exports.editEmp = function (
    id,
    name,
    email,
    contact,
    join_date,
    role,
    callback
) {
    var query =
        "update `employee` set `name`='" +
        name +
        "', `email`='" +
        email +
        "', `contact`='" +
        contact +
        "', `join_date`='" +
        join_date +
        "', `role`='" +
        role +
        "' where id=" +
        id;
    con.query(query, callback);
};

module.exports.getleavebyid = function (id, callback) {
    var query = "select * from leaves where id=" + id;
    con.query(query, callback);
};

module.exports.deleteleave = function (id, callback) {
    var query = "delete from `leaves` where id=" + id;
    con.query(query, callback);
};

module.exports.edit_leave = function (
    id,
    name,
    leave_type,
    from,
    to,
    reason,
    callback
) {
    var query =
        "update leaves set employee='" +
        name +
        "',leave_type='" +
        leave_type +
        "',date_from='" +
        from +
        "',date_to='" +
        to +
        "',reason='" +
        reason +
        "' where id=" +
        id;
    con.query(query, callback);
};

module.exports.searchEmp = function (key, callback) {
    var query = 'SELECT  *from employee where name  like "%' + key + '%"';
    con.query(query, callback);
    console.log(query);
};

module.exports.getAllpatient = function (callback) {
    var query = "SELECT * FROM patient"
    con.query(query, callback);
}

module.exports.add_patient = function (
    name,
    email,
    contact,
    age,
    doctor,
    bloodType,
    callback
) {
    var query =
        "Insert into `patient` (`name`,`email`,`contact`,`age`,`doctor`,`bloodType`) values ('" +
        name +
        "','" +
        email +
        "','" +
        contact +
        "','" +
        age +
        "','" +
        doctor +
        "','" +
        bloodType +
        "')";
    con.query(query, callback);

};

module.exports.getPatientbyId = function (id, callback) {
    var query = "SELECT * FROM patient WHERE id = " + id;
    con.query(query, callback);
}

module.exports.deletePatient = function (id, callback) {
    var query = "DELETE FROM patient WHERE id = " + id
    con.query(query, callback);
}

module.exports.searchPatient = function (key, callback) {
    var query = 'SELECT * from patient where name like "%' + key + '%"';
    con.query(query, callback);
}

module.exports.edit_patient = function (
    id,
    name,
    email,
    contact,
    age,
    doctor,
    bloodType,
    callback
) {
    var query =
        "update `patient` set `name`='" +
        name +
        "', `email`='" +
        email +
        "', `contact`='" +
        contact +
        "', `age`='" +
        age +
        "', `doctor`='" +
        doctor +
        "', `bloodType`='" +
        bloodType +
        "' where id=" +
        id;
    con.query(query, callback);
};