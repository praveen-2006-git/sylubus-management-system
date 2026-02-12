const http = require('http');

const API_PORT = 5000;

function request(method, path, token = null, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: API_PORT,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data }); // In case of non-JSON
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function run() {
    console.log('--- Starting RBAC Verification Flow (HTTP) ---');

    try {
        // 1. Admin Login
        console.log('\n[1] Admin Login...');
        const adminLogin = await request('POST', '/auth/login', null, { username: 'admin', password: 'admin123' });
        if (adminLogin.status !== 200) {
            console.error('Admin Login Failed:', adminLogin.data);
            process.exit(1);
        }
        const adminToken = adminLogin.data.token;
        console.log('Admin Logged In. Token acquired.');

        // 2. Get Departments
        console.log('\n[2] Fetching Departments...');
        const depts = await request('GET', '/departments', adminToken);
        // depts.data should be array
        if (!Array.isArray(depts.data)) {
            console.error('Failed to get departments:', depts.data);
            process.exit(1);
        }
        const cse = depts.data.find(d => d.name === 'CSE');
        if (!cse) {
            console.error('CSE Department not found.');
            process.exit(1);
        }
        console.log('CSE Department ID:', cse._id);

        // 3. Faculty Login (Seed created it)
        console.log('\n[3] Faculty Login...');
        const facultyLogin = await request('POST', '/auth/login', null, { username: 'faculty_test', password: 'password123' });
        if (facultyLogin.status !== 200) {
            console.log('Faculty Login Failed. Trying to create...');
            // Create if login failed (maybe seed didn't run?)
            // But we assume seed ran.
            console.error('Faculty Login Failed:', facultyLogin.data);
            process.exit(1);
        }
        const facultyToken = facultyLogin.data.token;
        console.log('Faculty Logged In.');

        // 4. Student Login (Seed created it)
        console.log('\n[4] Student Login...');
        const studentLogin = await request('POST', '/auth/login', null, { username: 'student_test', password: 'password123' });
        if (studentLogin.status !== 200) {
            console.error('Student Login Failed:', studentLogin.data);
            process.exit(1);
        }
        const studentToken = studentLogin.data.token;
        console.log('Student Logged In.');

        // 5. Verify Faculty Access to Subjects
        console.log('\n[5] Verifying Faculty Access...');
        const facultySubjects = await request('GET', '/subjects', facultyToken);
        console.log('Faculty Subjects Status:', facultySubjects.status);
        console.log('Faculty Subjects Count:', facultySubjects.data.length);
        if (facultySubjects.status === 200 && facultySubjects.data.length > 0) {
            console.log('Faculty Access: SUCCESS');
            // Check if they see "Data Structures"
            const hasDS = facultySubjects.data.some(s => s.name === 'Data Structures');
            console.log('Has Data Structures?', hasDS);
        } else {
            console.error('Faculty Access: FAILED or Empty');
        }

        // 6. Verify Student Access to Subjects
        console.log('\n[6] Verifying Student Access...');
        const studentSubjects = await request('GET', '/subjects', studentToken);
        console.log('Student Subjects Status:', studentSubjects.status);
        console.log('Student Subjects Count:', studentSubjects.data.length);
        if (studentSubjects.status === 200 && studentSubjects.data.length > 0) {
            console.log('Student Access: SUCCESS');
            const hasDS = studentSubjects.data.some(s => s.name === 'Data Structures');
            console.log('Has Data Structures?', hasDS);
        } else {
            console.error('Student Access: FAILED or Empty');
        }

    } catch (e) {
        console.error('Verification Error:', e);
    }
}

run();
