<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import passwordunhide from '../components/passwordHide.vue';
import { PhotoIcon } from '@heroicons/vue/20/solid';
import { DocumentIcon } from "@heroicons/vue/24/outline";

import { useRouter } from 'vue-router';
const router = useRouter();

const logo = require('@/assets/images/frrysfLOGO.png');

// Props
const dog = require('@/assets/images/home_animalshelter.png');

// Data
const showPassword = ref(false);
const files = ref([]);
const otherPhotos = ref(null);
const message = ref('');
const messageType = ref('');
const formData = ref(new FormData());
const userdetails = ref({
    sheltername: '',
    email: '',
    password: '',
});
const reg_type = ref('shelter');
const items = ref([]);
const termsChecked = ref(false);  // Track if terms are accepted
const showTermsModal = ref(false); // Control modal visibility

// Methods
// const handleMultipleFileChange = (event) => {
//     const fileArray = event.target.files;
//     files.value = [...files.value, ...fileArray];

//     Array.from(fileArray).forEach(file => {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             files.value.push({ file: file, url: event.target.result });
//         };
//         reader.readAsDataURL(file);
//     });
//     event.target.value = '';
// };

const handleMultipleFileChange = (event) => {
    const fileArray = event.target.files;

    Array.from(fileArray).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            // Push an object with file and its URL (data URL) along with the name of the file
            files.value.push({ file: file, url: event.target.result, name: file.name });
        };
        reader.readAsDataURL(file);
    });

    // event.target.value = ''; // Clear input value after reading
};

// Remove a file by its index
const removeFile = (index) => {
    files.value.splice(index, 1); // Remove the file from the array
};

const navigateTo = (path) => {
    // Navigate to a new path
    // useRouter().push(path);
    router.push(path);
};

// Nov21  Error tracking variables
const shelternameError = ref(false);
const emailError = ref(false);
const passwordError = ref(false);
const fileError = ref(false);
// Nov21 For password
const password = ref('');
const sheltername = ref('');
const email = ref('');
// // Nov21 Watch for changes in password value and set error state if empty
// watch(() => password.value, (newPassword) => {
//     passwordError.value = !newPassword; // Set error if password is empty
// });

const clearInput = () => {
    sheltername.value = ''
    email.value = ''
    password.value = '';
};

const handleSignup = async () => {
    try {
        // Nov21 Reset errors before validation
        shelternameError.value = false;
        emailError.value = false;
        passwordError.value = false;
        fileError.value = false;

        if (!sheltername.value || !email.value || !password.value || !termsChecked.value) {
            if (!termsChecked.value) alert("Please accept the terms and conditions.");
            return;
        }

        // Nov21 Validate the fields
        if (!sheltername.value) {
            shelternameError.value = true;
        }

        if (!email.value) {
            emailError.value = true;
        }

        if (!password.value) {
            passwordError.value = true;
        }

        if (!document.getElementById('sheltername').value || !document.getElementById('email').value ||
            !document.getElementById('password').value) {
            console.log("Some required fields are empty."); // Should have a user interface feedback
            formData.value = new FormData();
            return;
        }
        // Append user details
        formData.value.append('sheltername', document.getElementById('sheltername').value);
        formData.value.append('email', document.getElementById('email').value);
        formData.value.append('password', document.getElementById('password').value);
        formData.value.append('regtype', reg_type.value);

        console.log("Checking files...");
        if (!files.value || files.value.length === 0) {
            fileError.value = true; // Nov21 for styling
            formData.value = new FormData();
            console.log("No files to process or file array is empty.");
            return;
        }

        files.value.forEach((fileobj) => {
            formData.value.append('documents', fileobj.file);  // Add files with the key 'documents'
        });

        await setUser();
        clearInput()
    } catch (err) {
        console.log("Shelter registration error:", err);
    }
};

const setUser = async () => {
    console.log("Preparing to send request...");
    try {
        const response = await axios.post("http://localhost:5000/shelter-registration", formData.value, {
            'Content-Type': 'multipart/form-data'
        });

        items.value = response.data;
        if (response.data.success) {
            formData.value = new FormData();
            navigateTo('/shelterDashboard');
        } else {
            formData.value = new FormData();
            // Handle login failure
            console.log("ERRORRRRRRRRRRRRRRRRRRRRRR");
        }
        console.log("try and succesfull stage");
    } catch (err) {
        console.log("Error", err);
    } finally {
        // Optional: Clear files and user details
        files.value = [];
        userdetails.value = {
            sheltername: '',
            email: '',
            password: '',
        };
        console.log("finally stage");
    }

    };

        const openTermsModal = () => {
        showTermsModal.value = true;
    };

    const acceptTerms = () => {
        termsChecked.value = true;
        showTermsModal.value = false;
    };

    const goBack = () => {
        router.push('/login');  // Navigate back to login page
    };


</script>
<template>
    <section class="bg-white">
        <div class="lg:grid lg:min-h-screen lg:grid-cols-12 lg:pr-10">
            <section
                class="bg-blue-50 left-[6%]  relative h-32 items-end lg:col-span-5 lg:h-full xl:col-span-6 hidden lg:block">
                <img alt="" :src="dog" class="absolute inset-0 my-20 mx-10 h-[90%] w-[90%] object-contain " />

                <!-- <div class="hidden lg:relative lg:block lg:p-12">
                    <RouterLink class="block text-white" to="/">
                        <span class="sr-only">Home</span>
                    </RouterLink>

                </div> -->
            </section>

            <main
                class="mx-4 flex items-center justify-center min-h-screen px-8 sm:px-[2rem] lg:col-span-7 lg:px-8 xl:col-span-6">
                <div class="w-full md:w-2/3 mx-auto">
                    <div class="flex gap-x-2 items-center">
                        <RouterLink to="/">
                            <!-- <logo class="h-6 w-6 text-gray-800 hover:text-gray-700" /> -->
                            <img alt="FrrySfLogo" title="Home" :src="logo" class="h-10 w-10" />
                        </RouterLink>
                        <h1 class="text-2xl font-semibold text-gray-700">Sign up as a Shelter</h1>
                    </div>
                    <form action="#" class="mt-5 grid grid-cols-6 gap-6">
                        <div class="col-span-6">
                            <label class="text-gray-800 text-sm mb-2 block font-semibold">Shelter Name</label>
                            <input type="text" id="sheltername" v-model="sheltername"
                                :placeholder="shelternameError ? 'Shelter name is required' : 'Sheltername'"
                                :class="['w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm', { 'border-red-500 placeholder-red-500': shelternameError }]"
                                required />

                        </div>
                        <div class="col-span-6">
                            <label class="text-gray-800 text-sm mb-2 block font-semibold">Email</label>
                            <input type="email" id="email" v-model="email"
                                :placeholder="emailError ? 'Email Address is required' : 'Email'"
                                :class="['w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm', { 'border-red-500 placeholder-red-500': emailError }]"
                                required />

                        </div>
                        <div class="col-span-6">
                            <!-- <passwordunhide /> -->
                            <!-- Nov21  -->
                            <passwordunhide v-model="password" :passwordError="passwordError" />
                            <button @click="clearInput">Clear Password</button> 
                        </div>

                        <div class="col-span-6">
                            <!-- File input to accept multiple files (image and document files) -->
                            <div :class="{
                                'mt-3 outline-dashed outline-2 outline-offset-3 outline-gray-200 rounded-lg p-2 my-2': true,
                                'outline-red-500': fileError
                            }">
                                <label for="otherPhotos" class="cursor-pointer flex flex-col items-center gap-x-2">
                                    <input type="file" @change="handleMultipleFileChange"
                                        accept="image/*,application/pdf,.doc,.docx,.txt" multiple id="otherPhotos"
                                        ref="otherPhotos" class="hidden" />
                                    <PhotoIcon class="h-10 w-10 text-gray-200" />
                                    <span
                                        class="font-medium text-gray-400 sm:text-[10px] md:text-[12px] lg:text-[15px]">Choose
                                        file</span>
                                    <p class="text-gray-400 text-sm mt-2 text-center">Supported formats: DOC, DOCX,
                                        XLS, XLSX,
                                        PNG, JPG</p>
                                    <p class="text-gray-400 text-sm">Maximum size: 25MB</p>
                                </label>
                            </div>
                            <!-- Display names and types of selected files with a remove button -->
                            <div v-if="files.length > 0" class="container">
                                <ul>
                                    <li v-for="(file, index) in files" :key="index">
                                        <div class="flex gap-x-2 p-2 border gap-y-1 rounded-lg w-fit">
                                            <DocumentIcon class="h-6 w-6 text-gray-500" />
                                            <p class="flex truncate">{{ file.name }}</p>
                                            <button @click="removeFile(index)" class="remove-btn hover:text-red-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2" class="w-4 h-4">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <p v-if="fileError" class="text-red-500 text-xs flex justify-center">
                                A shelter must provide documentation for verification.</p>
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
                            By registering as a Shelter on FurrySafe, you agree to the following Terms and Conditions:

                            <br><br>
                            1. <strong>Business and Account Responsibility</strong>: 
                            As a registered Shelter, you are responsible for maintaining the accuracy and confidentiality of your business information, including your shelter name, contact details, and any other relevant account details. You agree to notify FurrySafe immediately if there is any unauthorized access to your account. FurrySafe is not liable for any unauthorized activities related to your account or any inaccurate information submitted.

                            <br><br>
                            2. <strong>Use of the Platform</strong>: 
                            By using FurrySafe, you agree to utilize the platform solely for lawful and ethical business practices related to animal rescue, care, and adoption. You shall not engage in activities that harm the platform's integrity, including but not limited to misrepresentation of animals, misuse of the system, or activities that violate animal welfare laws. FurrySafe reserves the right to suspend or terminate accounts for violations.

                            <br><br>
                            3. <strong>Animal Welfare</strong>: 
                            As a registered Shelter, you commit to ensuring the well-being and protection of the animals in your care. You agree to follow animal protection laws, including providing adequate shelter, nutrition, and medical care for rescued animals. FurrySafe expects you to participate in the platform's initiatives to promote responsible animal rescue and adoption.

                            <br><br>
                            4. <strong>Liability for Animals</strong>: 
                            By registering as a Shelter, you acknowledge that you are legally responsible for the care and safety of the animals placed under your care. You agree to comply with local laws and regulations regarding animal welfare and safety. FurrySafe will not be held responsible for any injury, illness, or harm to animals in your care, and you agree to indemnify FurrySafe from any such claims.

                            <br><br>
                            5. <strong>Privacy and Data Protection</strong>: 
                            You agree to respect the privacy of individuals using the FurrySafe platform. Any personal data collected, such as information on animal adoption applicants or your staff, must be handled in accordance with privacy laws and FurrySafe’s privacy policy. You agree to secure all personal and sensitive data and not misuse it for any purposes other than animal care and adoption.

                            <br><br>
                            6. <strong>Donations and Fundraising</strong>: 
                            If you choose to accept donations through the FurrySafe platform, you agree to comply with any applicable local regulations concerning fundraising and donations. FurrySafe is not responsible for the allocation or management of any donations; they are handled directly by your shelter. Any fundraising activities on the platform must be transparent and clearly communicate the purpose for which the funds will be used.

                            <br><br>
                            7. <strong>Termination and Suspension</strong>: 
                            FurrySafe reserves the right to suspend or terminate your Shelter account at any time if you are found to be in violation of these Terms and Conditions or engage in fraudulent or illegal activities. Upon termination, you will lose access to your account and any data associated with it. FurrySafe reserves the right to report any unlawful activity to the appropriate authorities.

                            <br><br>
                            8. <strong>Changes to Terms</strong>: 
                            FurrySafe reserves the right to modify these Terms and Conditions at any time. Changes will be posted on the platform, and your continued use of the platform will be considered acceptance of the updated terms. It is your responsibility to review the Terms and Conditions regularly to stay informed of any changes.

                            <br><br>
                            9. <strong>Indemnification</strong>: 
                            You agree to indemnify and hold harmless FurrySafe, its affiliates, officers, employees, and agents from any claims, losses, or damages arising from your actions, including but not limited to your failure to comply with local laws or mismanagement of animal care. This includes any legal costs, fees, or settlements resulting from a lawsuit filed against you or FurrySafe.

                            <br><br>
                            10. <strong>Limitation of Liability</strong>: 
                            FurrySafe is not liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. This includes damages related to loss of data, business interruptions, or any legal actions resulting from your participation in animal rescue or adoption activities. You use the platform at your own risk.

                            <br><br>
                            11. <strong>Governing Law</strong>: 
                            These Terms and Conditions shall be governed by the laws of the jurisdiction in which FurrySafe operates. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.

                            <br><br>
                            12. <strong>Force Majeure</strong>: 
                            FurrySafe will not be held responsible for any delay or failure to perform its obligations under these Terms and Conditions due to causes beyond its reasonable control, including but not limited to natural disasters, acts of government, or technical failures.

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

                            <p class="mt-10 text-sm text-gray-500 sm:mt-0">
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