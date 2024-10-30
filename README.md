# Server

Server for complete KCP Management.

### Installation

To install the application, follow the steps:

+ Simply download or clone the repo using `git clone` command.
+ Navigate to the project directory using `cd` command.
+ Install the required packages using `npm install` command.
+ Rename the `example.env` file to `.env` and set the environment variables in the file.
+ Run the application in dev mode using `npm run dev` command.
+ Run the application in production mode using `npm run server` command.
+ Open a web browser and navigate to [localhost:2626](http://127.0.0.1:2626) to access the application.

### Tools and Technologies
___

- Node.js
- Express.js
- MongoDB
- Redis
- JWT

### API Documentation
___

+ `/`
    - **GET**: Simple _'Hello World'_ page determining server is running.
    - **POST**: Simple _'Hello World'_ page determining server is running.

+ `/user`
    - **GET**: The following API routes available under this:
        - **P** `/profile` : Returns user profile including basic details.
        - **P** `/admin` : Returns details to populate Admin portal.
        - **P** `/manager` : Returns details to populate Manager portal.
        - **P** `/teacher` : Returns details to populate Teacher portal.
        - **P** `/student` : Returns details to populate Student portal.
        - **P** `/bankdetails` : Returns user bank information.
        - **U** `/logout` : Logout endpoint for application.

    - **POST**: The following API routes available under this:
        - **U** `/register` : Route for registration of users.
            _Note: The following endpoint cannot be used to register 'Admin' users._
        - **U** `/passwordreset` : Endpoint to reset password.
        - **P** `/profileupdate` : Profile updation endpoint including 'demographic', 'personal', 'educational' details.
        - **P** `/bankdetails` : Updates bank details of users.
        - **P** `/login` : Login endpoint for application.
        - **P** `/updatepassword` : Updates password.

+ `/verify`
    - **GET**: The following API routes available under this:
        - **U** `/email/:token` : Verifies email ID with help of token within specified timeframe.
        - **U** `/user/:userID` : Verified User based on user ID passed.

    - **POST**: The following API routes available under this:
        - **P** `/email` : Generates email verification token and sends mail for verification.
        - **P** `/number` : Sends OTP for mobile verification.
        - **P** `/otp` : Validates and verifies OTP for mobile verification.
        - **P** `/aadhar` : Updates and performs AADHAR authentication.

+ `/certificate`
    - **GET**: The following API routes available under this:
        - **U** `/verify/:certificateID` : Verifies and validates certificate from the ID passed.

    - **POST**: The following API routes available under this:
        - **P** `/generate` : Creates certificate for the user ID.

+ `/api`
    - **GET**: The following API routes available under this:
        - **U** `/notice` : Get notices for the Trusted Devices.

    - **POST**: The following API routes available under this:
        - **U** `/add` : Registers device client as Trusted Device.
        - **U** `/login` : Authenticates Trusted Device.
        - **P** `/auth` : Authenticates user.
        - **P** `/deauth` : Logs user out.
        - **P** `/logout` : Logout Trusted Device.

+ `/notice`
    - **GET**: The following API routes available under this:
        - **U** `/public` : Returns all Public Notices
        - **P** `/all` : Returns all notices.

    - **POST**: The following API routes available under this:
        - **P** `/create` : Creates a notice.
        - **P** `/edit` : Edits an existing notice.
        - **P** `/delete` : Delete a notification.

+ `/notification`
    - **GET**: The following API routes available under this:
        - **P** `/all` : Returns all notifications.

    - **POST**: The following API routes available under this:
        - **P** `/update` : Updates a notification (read/unread).

+ `/cdn`
    - **GET**: The following API routes available under this:
        - **U** `/client/:assetID` : Returns assets avalaible for Trusted Device interface.
        - **P** `/:department` : Lists and returns assets available for department.
        - **P** `/asset/:assetID` : Returns special assets for priveldged or admin users.

    - **POST**: The following API routes available under this:
        - **P** `/add` : Adds an asset.
        - **P** `/update` : Update an asset.
        - **P** `/delete` : Delete an asset.

+ `/leave`
    - **GET**: The following API routes available under this:
        - **P** `/all` : Returns all leaves.
            _Note: The following endpoint can only be used by 'Admin' or 'Management' users._
        - **P** `/watch` : Returns all leaves related to user.
            _Note: The following endpoint cannot be used by 'Student' or 'Trusted' users._
        - **P** `/status/:leaveID` : Returns the status of leave application.

    - **POST**: The following API routes available under this:
        - **P** `/approve/:leaveID` : Approves a leave.
        - **P** `/decline/:leaveID` : Rejects a leave.
        - **P** `/apply` : Appy for a leave.

+ `/bill`
    - **GET**: The following API routes available under this:
        - **U** `/view/:billID` : Returns the specified bill.
        - **U** `/date/:date` : Returns all bills for the specified date.
        - **U** `/month/:month` : Returns all bills for the specified month.
        - **U** `/year/:year` : Returns all bills for the specified year.
        - **U** `/all` : Returns all bills.

    - **POST**: The following API routes available under this:
        - **U** `/generate` : Generates bill.

+ `/utm`
    - **GET**: The following API routes available under this:
        - **U** `/get/:service` : Returns total interactions for the specified service.
        - **U** `/all` : Returns total interactions.

    - **POST**: The following API routes available under this:
        - **U** `/add/:campaignID` : Updates interactions for Campaign.
        - **U** `/add` : Updates anonymous or organic interactions.

### Usage
___

- **U**: User authentication not required.
- **P**: User authentication required.
- The api routes should be used in the following manner: `[application url] / [category] / [addition params]`.

### Users
___

Types of users present in the system:

+ **Admin** : Users with highest privledges.
+ **Management** : Users with updation, creation and deletion permissions.
+ **Teacher** : Users with interaction and report management permissions.
+ **Student** : Users with least privledges.
+ **Trusted** : Users regarded as application or network devices.
+ **Anonymous** : Default User. Users with no permissions other than open or public actions or unprotected routes.

### Database Schemas
___

_**MongoDB Database:**_

- **Users** - UserID, Name, Email, Password, Role, ContactNumber, Aadhar, Gender, Address, Education, DOB, Leave, CentreID, DOJ.
- **Devices** - DeviceID, MAC Address, CentreID.
- **Students** - UserID, CourseEnrolled, TimeAllotted, Certificates, Fee.
- **Teachers** - UserID, CourseTeaching, Specialization, Salary, TimingsAllotted.
- **Managers** - UserID, Salary.
- **Admins** - UserID, Salary.
- **Centres** - CentreID, Admin, Address, Devices, Teachers, Students.
- **Leaves** - LeaveID, UserID, LeaveType, LeaveDate, LeaveStatus, LeaveReason.
- **Certificates** - CertificateID, Course, DateIssued, UserID.
- **Notices** - NoticeID, NoticeType, Body.
- **Notifications** - NotificationID, Body, Status.
- **Transactions** - TransactionID, TransactionDate, Status, UserID, Notes, Amount.
- **Assets** - AssetID, AssetLocation, Type, Role.
- **Bills** - BillID, BillDate, BillAmount, BillStatus, BillingAddress, CustomerName, ServicesUsed.
- **Interactions** - InteractionID, InteractionDate, InteractionType, InteractionStatus.

_**Redis Database:**_

- **LogTime** - TimeStamp, DeviceID, UserID

### Developer
___
+ Bryan Christy