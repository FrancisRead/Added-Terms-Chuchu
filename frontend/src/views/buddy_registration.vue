<template>
    <section class="bg-white max-h-screen">
        <div class="lg:grid lg:grid-cols-12 mx-4">
            <section
                class="bg-blue-50 left-[6%]  relative h-32 items-end  lg:col-span-5 lg:h-full xl:col-span-6 hidden lg:block">
                <img alt="" :src="require('@/assets/images/home_animalshelter.png')"
                    class="absolute inset-0 my-20 mx-10 h-[90%] w-[90%] object-contain " />

                <div class="hidden lg:relative lg:block lg:p-12">
                    <a class="block text-white" href="#">
                        <span class="sr-only">Home</span>
                    </a>

                </div>
            </section>

            <main
                class="flex items-center justify-center min-h-screen px-8 sm:px-[2rem] lg:col-span-7 lg:px-8 lg:py-12 xl:col-span-6">
                <div class="w-full md:w-2/3 mx-auto">
                    <div class="flex gap-x-2 items-center">
                        <RouterLink to="/">
                            <!-- <HomeIcon class="h-6 w-6 text-gray-800 hover:text-gray-700" /> -->
                            <img alt="FrrySfLogo" title="Home" :src="logo" class="h-10 w-10" />
                        </RouterLink>
                        <h1 class="text-2xl font-semibold text-gray-800 ">Sign up as Buddy</h1>
                    </div>

                    <form action="#" class=" mt-5 grid grid-cols-6 gap-6 ">
                        <div class="sm:col-span-6 md:col-span-3 ">
                            <label class=" text-gray-800 text-sm mb-2 block font-semibold">First Name</label>
                            <input type="text" id="fname" v-model="firstName" placeholder="First Name"
                                class=" w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm"
                                required />
                            <p v-if="!firstName && submitted" class="text-red-500 text-[11px]">*First Name is required
                            </p>
                        </div>
                        <div class="sm:col-span-6 md:col-span-3 ">
                            <label class="text-gray-800 text-sm mb-2 block font-semibold">Last Name</label>
                            <input type="text" id="lname" v-model="lastName" placeholder="Last Name"
                                class="w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm"
                                required />
                            <p v-if="!lastName && submitted" class="text-red-500 text-[11px]">*Last Name is required</p>
                        </div>
                        <div class="col-span-6">
                            <label class="text-gray-800 text-sm mb-2 block font-semibold">Username</label>
                            <input type="text" id="username" v-model="username" placeholder="Username"
                                class="w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm"
                                required />
                            <p v-if="!username && submitted" class="text-red-500 text-[11px]">*Username is required</p>
                        </div>
                        <div class="col-span-6">
                            <label class="text-gray-800 text-sm mb-2 block font-semibold">Email</label>
                            <input type="email" id="email" v-model="email" placeholder="Email"
                                class="w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm"
                                required />
                            <p v-if="!email && submitted" class="text-red-500 text-[11px]">*Email is required</p>
                        </div>
                        <div class="col-span-6">
                            <passwordunhide />

                            <p v-if="!password && submitted" class="text-red-500 text-[11px]">*Password is required</p>
                        </div>
                        <div
                            class="col-span-6 gap-y-6 gap-x-6 field w-full grid sm:grid-flow-row md:grid-flow-col items-center">

                            <div class="">
                                <label for="bdate"
                                    class="text-gray-800 text-sm mb-2 block font-semibold">Birth-date</label>
                                <input type="date" id="bdate" class="border w-full rounded-lg p-2 sm:text-sm">
                            </div>
                            <div class="field items-center grid">
                                <label class="pr-2 text-gray-800 text-sm mb-2 block font-semibold">Gender</label>
                                <Dropdown v-model="gender" />
                            </div>
                        </div>
                        <div class="col-span-6 flex flex-col justify-center items-center gap-y-2">
                        <div class="flex items-center gap-x-2">
                            <input
                                type="checkbox"
                                v-model="termsChecked"
                                :disabled="!termsChecked"
                                class="form-checkbox"
                            />
                            <label for="terms" class="text-sm text-gray-500">
                                By creating an account, you agree to our
                                <a href="#" @click.prevent="openTermsModal" class="text-gray-700 underline">terms and conditions</a>
                                and
                                <a href="#" class="text-gray-700 underline">privacy policy</a>.
                            </label>
                        </div>
                        <p v-if="!termsChecked && submitted" class="text-red-500 text-[11px]">*You must agree to the terms and conditions</p>
                    </div>
                    <!-- Modal for Terms and Conditions -->
                    <div v-if="showTermsModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                        <div class="bg-white p-6 rounded-lg w-3/4 md:w-1/2 max-h-[80vh] overflow-y-auto">
                            <h2 class="text-xl font-semibold text-gray-800 mb-4">Terms and Conditions</h2>
                            <p class="text-sm text-gray-700 mb-4">
                            By registering as a Buddy on FurrySafe, you agree to the following Terms and Conditions:

                            <br><br>
                            1. <strong>Account Responsibility</strong>: 
                            You are responsible for maintaining the confidentiality of your account information, including your username, password, and other account details. You agree to notify FurrySafe immediately if you believe your account has been compromised or accessed without your authorization. FurrySafe will not be liable for any unauthorized access or activities related to your account.

                            <br><br>
                            2. <strong>Use of the Platform</strong>: 
                            As a Buddy, you agree to use the FurrySafe platform solely for lawful purposes. You shall not engage in any activity that could harm, disrupt, or interfere with the functioning of the platform, including but not limited to spamming, malware, or phishing activities. You are also prohibited from attempting to gain unauthorized access to any other user’s data, account, or private information.

                            <br><br>
                            3. <strong>Animal Rescue Participation</strong>: 
                            By using FurrySafe, you agree to participate in animal rescue efforts in good faith. This includes accurately reporting stray animals, assisting in the rescue process, and providing necessary information to shelters or rescue groups when needed. You agree to respect the well-being of the animals and follow the guidelines set forth by FurrySafe and participating shelters.

                            <br><br>
                            4. <strong>Community Engagement</strong>: 
                            You agree to engage respectfully with other users of the platform, including shelters, rescuers, and the FurrySafe team. Any form of abusive, offensive, discriminatory, or harmful behavior towards other users will not be tolerated. Such actions may result in the suspension or termination of your account. FurrySafe reserves the right to remove or block any content that violates community guidelines.

                            <br><br>
                            5. <strong>Privacy</strong>: 
                            You agree to FurrySafe’s Privacy Policy, which governs how your personal information is collected, used, and shared. FurrySafe may collect personal data, including but not limited to your name, email, and location, to facilitate animal rescue operations and enhance your experience on the platform. Your information may be shared with shelters, rescue groups, and emergency responders in the event of a rescue operation.

                            <br><br>
                            6. <strong>Donations</strong>: 
                            If you choose to donate through the FurrySafe platform, you agree to the donation terms, which may include applicable processing fees, refund policies, and donation terms specified by the platform. Donations made through FurrySafe are voluntary, and you understand that they are non-refundable unless explicitly stated in special circumstances. FurrySafe does not guarantee that donations will be directly allocated to specific causes.

                            <br><br>
                            7. <strong>Indemnification</strong>: 
                            You agree to indemnify and hold harmless FurrySafe, its affiliates, officers, employees, and agents from any claims, losses, or damages arising from your use of the platform. This includes, but is not limited to, any damages arising from your participation in animal rescues, your communications with other users, or your failure to comply with the Terms and Conditions.

                            <br><br>
                            8. <strong>Termination of Account</strong>: 
                            FurrySafe reserves the right to terminate or suspend your account at any time without notice and at its sole discretion if you violate these Terms and Conditions. This includes, but is not limited to, engaging in fraudulent activities, providing false information, or abusing the platform. Upon termination, you will lose access to your account and any content associated with it.

                            <br><br>
                            9. <strong>Changes to Terms</strong>: 
                            FurrySafe may modify these Terms and Conditions at any time. All changes will be posted on the platform, and your continued use of the platform will be considered as acceptance of the updated terms. You are advised to review the Terms and Conditions regularly to stay informed about any changes.

                            <br><br>
                            10. <strong>Limitation of Liability</strong>: 
                            FurrySafe is not liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. This includes damages related to the loss of data, business interruption, or damages arising from user-generated content or third-party actions. You use the platform at your own risk.

                            <br><br>
                            11. <strong>Governing Law</strong>: 
                            These Terms and Conditions will be governed by and construed in accordance with the laws of the jurisdiction in which FurrySafe operates. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in that jurisdiction.

                            <br><br>
                            12. <strong>Force Majeure</strong>: 
                            FurrySafe will not be held responsible for any failure or delay in performance of its obligations under these Terms and Conditions due to causes beyond its reasonable control, including, but not limited to, acts of God, natural disasters, or government restrictions.

                            <br><br>
                            If you have any questions or concerns about these Terms and Conditions, please contact us at support@furrysafe.com.
                            </p>
                            <div class="flex justify-center mt-4">
                                <button 
                                    @click="acceptTerms" 
                                    class="bg-gray-800 text-white text-sm px-4 py-2 rounded-md hover:bg-teal-600 transition duration-300">
                                    Accept
                                </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-span-6 flex flex-col justify-center items-center gap-y-2 ">
                            <button @click.prevent="handleSignup()"
                                class="w-full bg-gray-800 text-white py-3  rounded-lg hover:bg-teal-600 transition duration-300">
                                Create an account
                            </button>

                            <p class="text-sm text-gray-500 sm:mt-0">
                                Already have an account?
                                <a href="#" @click="goBack" class="text-gray-700 underline">Log in</a>.
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import Dropdown from "../components/registration_dropdown.vue";
import passwordunhide from "../components/passwordHide.vue";
import { HomeIcon } from '@heroicons/vue/20/solid'

export default {
    name: 'LoginShelter',
    components: {
        Dropdown,
        passwordunhide,
        HomeIcon
    },
    data() {
        return {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            birthMonth: '',
            birthDay: '',
            birthYear: '',
            gender: '',
            termsChecked: false,  
            showTermsModal: false,  
            submitted: false,
            logo: require('@/assets/images/frrysfLOGO.png'),
            dog: require('@/assets/images/animalshelterdog.png'),
            formData: new FormData(),
            userdetails: {
                firstname: 'fname',
                lastname: 'lname',
                username: 'username',
                dob: 'bdate',
                gender: 'gender',
                email: 'email',
                password: 'password',
            },
            reg_type: 'buddy',
            items: [],
        };
    },
    methods: {
        goBack() {
            this.$router.push({ name: 'login' }); // Navigate to login.vue
        },

        handleSignup() {
        this.submitted = true;

        // Validate form inputs
        if (this.firstName && this.lastName && this.username && this.email && this.password && this.termsChecked) {
            // Create a user object
            const user = {
                firstName: this.firstName,
                lastName: this.lastName,
                username: this.username,
                email: this.email,
                password: this.password,
                birthDate: `${this.birthYear}-${this.birthMonth}-${this.birthDay}`,
                gender: this.gender
            };

            // Send the user data to the backend (adjust API endpoint and request method as needed)
            axios.post('your-backend-api-endpoint', user)
                .then(response => {
                    // Handle successful signup (e.g., redirect to login page or show success message)
                    console.log(response.data);
                    this.$router.push('/login');  // Redirect to login page after successful registration
                })
                .catch(error => {
                    // Handle error during signup
                    console.error(error);
                    alert('Error during signup, please try again.');
                });
        } else {
            // Handle case where form is not complete
            alert('Please fill all the required fields and accept the terms.');
        }
        },
        openTermsModal() {
            this.showTermsModal = true;
        },
        acceptTerms() {
            this.termsChecked = true;
            this.showTermsModal = false;
        },
        goBack() {
            this.$router.push('/login');  // Navigate back to login page
        },

        handleLoginSubmit() {
            this.submitted = true; // Set submitted to true on form submission
            // Handle form submission logic here
            if (this.firstName && this.lastName && this.email && this.password) {
                // Proceed with form submission
                console.log('Form submitted successfully!');
            }
        },
        handleRegisterSubmit() {
            this.isStepTwo = true;
            this.activeStep = 2;
        },
        goToStepThree() {
            this.isStepThree = true;
            this.activeStep = 3;
        },
        range(start, end) {
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        },
        navigateTo(path) {
            this.$router.push(path);
        },
        async handleSignup() {
            try {
                this.userdetails = {
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                    firstname: document.getElementById('fname').value,
                    lastname: document.getElementById('lname').value,
                    username: document.getElementById('username').value,
                    gender: document.getElementById('gender').value,
                    dob: document.getElementById('bdate').value
                }

                if (!this.userdetails.firstname || !this.userdetails.lastname ||
                    !this.userdetails.email || !this.userdetails.password || !this.userdetails.gender) {
                    console.log("Some required fields are empty.");
                    this.formData = new FormData();
                    return;
                }
                if (this.userdetails.gender == "  ") {
                    this.userdetails.gender = 'unspecified'
                }

                this.formData.append('dob', this.userdetails.dob);
                this.formData.append('email', this.userdetails.email);
                this.formData.append('password', this.userdetails.password);
                this.formData.append('firstname', this.userdetails.firstname);
                this.formData.append('lastname', this.userdetails.lastname);
                this.formData.append('username', this.userdetails.username,);
                this.formData.append('gender', this.userdetails.gender);
                this.formData.append('regtype', this.reg_type);

                await this.setUser();
            }
            catch (err) {
                console.log("error", err)
            }
        },
        async setUser() {
            try {
                const response = await axios.post("http://localhost:5000/buddy-registration", this.formData,
                    {
                        'Content-Type': 'multipart/form-data'
                    }
                )
                this.items = response.data
                console.log("response: ", response.data);
                if (response.data.success) {
                    this.formData = new FormData();
                    this.navigateTo('/');
                } else {
                    this.formData = new FormData();
                    console.log("ERRORRRRRRRRRRRRRRRRRRRRRR");
                }
            }
            catch (err) {
                console.log("An ERROR occurred: " + err);
            }
            finally {
                this.files = [];
                this.userdetails = {
                    sheltername: '',
                    email: '',
                    password: '',
                }
            }
        }
    }
}
</script>