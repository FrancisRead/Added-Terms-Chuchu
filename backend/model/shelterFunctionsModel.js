import supabase from "../config/database.js";
import bcrypt from "bcrypt";
import multer from "multer";

const prefix = "/storage/v1/object/public/pets_images/";

//cloud storage used for saving images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, date.now() + "-" + file.originalname);
  },
});

//newly logged in after shelter verificaion (adds a new address to the shelter)
export const addShelterAddress = async (req, res) => {
  try {
    const { address, latitude, longitude, id } = req.body;
    const { data, err } = await supabase.rpc("insert_shelter_address", {
      _shelter_address: address,
      _lat: latitude,
      _lng: longitude,
      _shelterid: id,
    });
    if (err) {
      console.log("Error:", err);
    } else {
      return res.status(200).json({
        success: true,
      });
    }
  } catch (err) {
    console.log("An error occurred while saving address", err);
    res.status(500).send("Server Error");
  }
};
//retrieves shelter profile details (tbl_shelter, tbl_shelter_details, tbl_shelter_link)
export const retrieveShelterDetails = async (req, res) => {
  try {
    const { shelterid } = req.body;
    const { data, error } = await supabase.rpc("retrieve_shelter_details", {
      _shelterid: shelterid,
    });
    if (error) {
      console.log("Error:", error);
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    console.log("an error occured retrieving shelter details", err);
  }
};
//retrieves profile picture from cloud storage (bucket (images))
export const retrieveProfile = async (req, res) => {
  try {
    const { profileUrl } = req.body;

    const { data: imageData, error } = supabase.storage
      .from("images")
      .getPublicUrl(profileUrl);

    if (error) {
      console.error("Error getting public URL:", error);
    } else {
      res.status(200).send({
        data: imageData.publicUrl,
        message: "Shelter details saved successfully",
      });
    }
  } catch (err) { }
};
//save modified shelter details and links
export const saveShelter_and_Link = async (req, res) => {
  try {
    const {
      shelterid,
      sheltername,
      shelteraddress,
      image,
      contact,
      email,
      latitude,
      longitude,
      bio,
      links,
    } = req.body;
    const file = req.file;
    let filePath = null;

    if (file) {
      filePath = `user_images/${Date.now()}_${file.originalname}`;

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
        });

      if (!uploadError) {
        const { data: profileUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);
        filePath = profileUrlData.publicUrl; // Profile photo URL

        console.error("Profile uploaded:", filePath);
      } else {
        return res
          .status(500)
          .send({ message: "Failed to upload profile image." });
      }
    } else {
      filePath = image;
    }

    let linksArray;
    if (Array.isArray(links)) {
      // If links is already an array
      linksArray = links;
    } else if (typeof links === "string") {
      try {
        // Try parsing if it's a JSON-formatted string
        const parsedLinks = JSON.parse(links);
        if (Array.isArray(parsedLinks)) {
          linksArray = parsedLinks;
        } else {
          // If parsing doesn't yield an array, treat it as a single link
          linksArray = [links];
        }
      } catch (e) {
        // If parsing fails, assume it's a single link
        linksArray = [links];
      }
    } else {
      // If links is neither an array nor a string, default to an empty array
      linksArray = [];
    }

    let contactValue;
    if (contact === "") {
      contactValue = null; // Convert empty string to null
    } else if (typeof contact === "string") {
      contactValue = parseInt(contact); // Convert string to integer
      if (isNaN(contactValue)) {
        contactValue = null; // Set to null if conversion fails
      }
    } else {
      contactValue = contact; // Leave as is if it's already a number
    }

    console.log("file path to save", filePath);
    // Call the RPC function to update shelter details
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "update_shelter_details",
      {
        _id: parseInt(shelterid, 10),
        _sheltername: sheltername,
        _address: shelteraddress,
        _lat: latitude,
        _lng: longitude,
        _contact: contactValue,
        _email: email,
        _profileurl: filePath, // store uploaded file path
        _bio: bio,
        _links: linksArray,
      }
    );

    if (rpcError) {
      console.error("Database insert error:", rpcError);
      return res
        .status(500)
        .send({ success: false, message: "Failed to save shelter details" });
    }

    console.log("Database insert success");
    res
      .status(200)
      .send({ success: true, message: "Shelter details saved successfully" });
  } catch (err) {
    console.log("Save Shelter Details and Link Error:", err);
    res.status(500).send({ message: "Internal server error" });
  }
};
//retrieve pet details and EVERYTHING KATUNG FOCKING 14??? TABLE QUERY
export const retrievePetProfile = async (req, res) => {
  let { _userid, _petid, _post_id } = req.body;

  _post_id = _post_id == null || _post_id == "null" ? null : _post_id;

  try {
    const { data, error } = await supabase.rpc("retrieve_pet_profiles", {
      _user_id: _userid,
      _pet_id: _petid,
      _post_id: _post_id,
    });
    if (error) {
      console.log("Error:", error);
    } else {
      console.log(data);
      return res.status(200).json(data);
    }
  } catch (err) {
    console.log("Error occured when retrieving pet profiles");
  }
};
//retrieve pet breed
export const retrievePetBreed = async (req, res) => {
  const { _category_id } = req.body;
  try {
    const { data, err } = await supabase.rpc("retrieve_pet_breed", {
      _pet_type: _category_id,
    });
    if (err) {
      console.log("Error:", err);
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    console.log("error retrieving pet breed", err);
  }
};
//retrieve vaccine category
export const retrieveVaccineCategory = async (req, res) => {
  const { _category_id } = req.body;
  try {
    const { data, err } = await supabase.rpc("retrieve_pet_vaccine", {
      _pet_type: _category_id,
    });
    if (err) {
      console.log("Error:", err);
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    console.log("error in retrieving vaccine", err);
  }
};
//retrieve sterilization
export const retrieveSterilization = async (req, res) => {
  const { _gender } = req.body;
  try {
    const { data, err } = await supabase.rpc("retrieve_sterilization", {
      _gender: _gender,
    });
    if (err) {
      console.log("Error:", err);
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    console.log(err);
  }
};
//retrieve pet status
export const retrievePetStatus = async (req, res) => {
  try {
    const { data, err } = await supabase.rpc("retrieve_pet_status");
    if (err) {
      console.log("Error:", err);
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    console.log("error retrieving pet status", err);
  }
};
//saving || used in create
export const savepetprofie = async (req, res) => {
  try {
    let {
      id,
      gender,
      pet_category_id,
      other_pet_category,
      breed_id,
      other_breed,
      status,
      name,
      nickname,
      daterehomed,
      age,
      sizeweight,
      coat,
      about,
      special_needs,
      med_condition,
      vaccines = [],
      other_vaccines,
      other_sterilization,
      sterilization_id,
      energylevel,
    } = req.body;

    if (sterilization_id == "null") {
      sterilization_id = null;
    }

    if (typeof vaccines === "string") {
      vaccines = [vaccines]; // Convert string to array
    } else if (!Array.isArray(vaccines)) {
      vaccines = []; // Default to empty array if not an array or string
    }

    age = Number(age);
    // age = typeof age == 'string' ? 0 : age
    let pet_type = null;
    let pet_breed = null;

    if (pet_category_id !== "Other") {
      pet_type = parseInt(pet_category_id, 10);
      pet_breed = parseInt(breed_id, 10);
    }

    const status_id = parseInt(status, 10);
    const sterilization_id_int = parseInt(sterilization_id, 10);
    // const vaccine_ids = vaccines.map(id => parseInt(id, 10)).filter(id => !isNaN(id));

    const files = req.files;
    let profileUrl = null;

    // Upload Profile Photo
    const profileFile = files.find((file) => file.fieldname === "profile");
    const extraPhotos = files.filter(
      (file) => file.fieldname === "extra_photo"
    );
    if (!profileFile) {
      profileUrl = req.body.profile
    }

    if (breed_id == "Other") {
      breed_id = null;
    }

    const extraPhotoUrls = [];

    if (profileFile) {
      const profileFilePath = `pets_profiles/${Date.now()}_${profileFile.originalname
        }`;
      const { data: profileUploadData, error: profileUploadError } =
        await supabase.storage
          .from("pets_images") // Ensure this is your correct bucket name
          .upload(profileFilePath, profileFile.buffer, {
            contentType: profileFile.mimetype,
          });

      if (!profileUploadError) {
        const { data: profileUrlData } = supabase.storage
          .from("pets_images")
          .getPublicUrl(profileFilePath);
        profileUrl = profileUrlData.publicUrl; // Profile photo URL
      } else {
        console.error("Profile upload error:", profileUploadError);
        return res
          .status(500)
          .send({ message: "Failed to upload profile image." });
      }
    }

    // Upload Extra Photos
    for (const photo of extraPhotos) {
      const photoPath = `pets_photos/${Date.now()}_${photo.originalname}`;
      const { data: photoUploadData, error: photoUploadError } =
        await supabase.storage
          .from("pets_images") // Ensure this is your correct bucket name
          .upload(photoPath, photo.buffer, {
            contentType: photo.mimetype,
          });

      if (!photoUploadError) {
        const { data: photoUrlData } = supabase.storage
          .from("pets_images")
          .getPublicUrl(photoPath);
        extraPhotoUrls.push(photoUrlData.publicUrl); // Collecting extra photo URLs
      } else {
        console.error("Extra photo upload error:", photoUploadError);
        return res
          .status(500)
          .send({ message: "Failed to upload extra photos." });
      }
    }

    // Ensure all required fields are present
    if (
      name &&
      gender &&
      status_id &&
      (pet_type || other_pet_category) &&
      (other_sterilization || sterilization_id_int)
    ) {
      const { data, error } = await supabase.rpc("insert_pet_data", {
        _about_pet: about,
        _age: age,
        _breed_id: pet_breed,
        _coat_fur: coat,
        _date_rehomed: daterehomed,
        _energy_level: energylevel,
        _gender: gender,
        _medical_condition: med_condition,
        _other_breed: other_breed,
        _other_pet_type: other_pet_category,
        _other_sterilization: other_sterilization,
        _other_vaccine: other_vaccines,
        _owner_id: id,
        _pet_extra_photos: extraPhotoUrls,
        _pet_name: name,
        _pet_nickname: nickname,
        _pet_profile_url: profileUrl,
        _pet_type: pet_type,
        _size_weight: sizeweight,
        _special_needs: special_needs,
        _status_id: status,
        _sterilization_id: sterilization_id,
        _vaccine_id: vaccines,
      });

      if (error) {
        console.error("Database insert error:", error);
        return res
          .status(500)
          .send({ message: "Failed to save image URLs to the database." });
      } else {
        res.status(200).send({ success: true });
      }

      // Success response
    } else {
      return res.status(400).send({ message: "Error: Missing inputs." });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).send({ message: error });
  }
};
//updating || used in edit
export const updatepetprofile = async (req, res) => {
  try {
    let {
      id,
      pet_id,
      gender,
      pet_category_id,
      other_pet_category,
      breed_id,
      other_breed,
      status,
      name,
      nickname,
      old_profile,
      daterehomed,
      energylevel,
      age,
      sizeweight,
      coat,
      about,
      special_needs,
      old_files,
      list_of_old_files,
      med_condition,
      other_vaccines,
      other_sterilization,
      sterilization_id,
      vaccines,
    } = req.body;

    id = id === 'null' || id === '' ? null : id
    pet_id = pet_id === 'null' || pet_id === '' ? null : pet_id
    gender = gender === 'null' || gender === '' ? null : gender
    pet_category_id = pet_category_id === 'null' || pet_category_id === '' ? null : pet_category_id
    other_pet_category = other_pet_category === 'null' || other_pet_category === '' ? null : other_pet_category
    breed_id = breed_id === 'null' || breed_id === '' ? null : breed_id
    other_breed = other_breed === 'null' || other_breed === '' ? null : other_breed
    status = status === 'null' || status === '' ? null : status
    name = name === 'null' || name === '' ? null : name
    nickname = nickname === 'null' || nickname === '' ? null : nickname
    old_profile = old_profile === 'null' || old_profile === '' ? null : old_profile
    daterehomed = daterehomed === 'null' || daterehomed === '' ? null : daterehomed
    energylevel = energylevel === 'null' || energylevel === '' ? null : energylevel
    age = age === 'null' || age === '' ? 0 : age
    sizeweight = sizeweight === 'null' || sizeweight === '' ? null : sizeweight
    coat = coat === 'null' || coat === '' ? null : coat
    about = about === 'null' || about === '' ? null : about
    special_needs = special_needs === 'null' || special_needs === '' ? null : special_needs
    old_files = old_files === 'null' || old_files === '' ? null : old_files
    list_of_old_files = list_of_old_files === 'null' || list_of_old_files === '' ? null : list_of_old_files
    med_condition = med_condition === 'null' || med_condition === '' ? null : med_condition
    other_vaccines = other_vaccines === 'null' || other_vaccines === '' ? null : other_vaccines
    other_sterilization = other_sterilization === 'null' || other_sterilization === '' ? null : other_sterilization
    sterilization_id = sterilization_id === 'null' || sterilization_id === '' ? null : sterilization_id
    vaccines = vaccines === 'null' || vaccines === '' ? null : vaccines

    const files = req.files;
    const photoToDelete = await comparePetExtraPhoto(
      old_files,
      list_of_old_files
    );

    // for (const file in req.files) {
    //     console.log(`File ${file}:`);
    //     console.log(req.files[file]);
    // }
    const profileFile = files.find((file) => file.fieldname === "new_profile");
    const extraPhotos = files.filter((file) => file.fieldname === "files");

    let fromDbExtraPhotosUrl = [old_files];
    let profileUrl = old_profile;
    const extraPhotoUrls = [];
    let new_profile_path = null;
    const old_profile_path = new URL(old_profile).pathname.replace(prefix, "");

    if (profileFile) {
      //if true then save new profile to cloud and delete prev photo
      const profileFilePath = `pets_profiles/${Date.now()}_${profileFile.originalname
        }`;
      const { data: profileUploadData, error: profileUploadError } =
        await supabase.storage
          .from("pets_images") // Ensure this is your correct bucket name
          .upload(profileFilePath, profileFile.buffer, {
            contentType: profileFile.mimetype,
          });

      if (!profileUploadError) {
        const { data: profileUrlData } = supabase.storage
          .from("pets_images")
          .getPublicUrl(profileFilePath);
        profileUrl = profileUrlData.publicUrl; // Profile photo URL
        comparePetProfilePhoto(old_profile_path);
      } else {
        console.error("Profile upload error:", profileUploadError);
        return res
          .status(500)
          .send({ message: "Failed to upload profile image." });
      }
    }

    comparePetExtraPhoto(old_files, list_of_old_files);
    for (const photo of extraPhotos) {
      const photoPath = `pets_photos/${Date.now()}_${photo.originalname}`;
      const { data: photoUploadData, error: photoUploadError } =
        await supabase.storage
          .from("pets_images") // Ensure this is your correct bucket name
          .upload(photoPath, photo.buffer, {
            contentType: photo.mimetype,
          });

      if (!photoUploadError) {
        const { data: photoUrlData } = supabase.storage
          .from("pets_images")
          .getPublicUrl(photoPath);
        extraPhotoUrls.push(photoUrlData.publicUrl); // Collecting extra photo URLs
      } else {
        console.error("Extra photo upload error:", photoUploadError);
        return res
          .status(500)
          .send({ message: "Failed to upload extra photos." });
      }
    }

    if (Array.isArray(fromDbExtraPhotosUrl)) {
      fromDbExtraPhotosUrl.forEach((photo) => {
        extraPhotoUrls.push(photo);
      });
    }

    if (other_vaccines === "No vaccines recorded") {
      other_vaccines = null;
    }

    // other_vaccines = other_vaccines == 'No vaccines recorded' ? null : other_vaccines

    if (vaccines !== null) {
      if (typeof vaccines === "string") {
        // If it's a string, convert it to an array with one element
        vaccines = [Number(vaccines)];
      } else if (Array.isArray(vaccines)) {
        // If it's an array, map through it to convert all elements to numbers
        vaccines = vaccines.map((v) => Number(v));
      }
    } else {
      // Handle the case where vaccines is null
      vaccines = null;
    }
    console.log("Logging here:");
    console.log('pet_id:', pet_id);
    console.log('gender:', gender);
    console.log('pet_category_id:', pet_category_id);
    console.log('other_pet_category:', other_pet_category);
    console.log('breed_id:', breed_id);
    console.log('other_breed:', other_breed);
    console.log('status:', status);
    console.log('name:', name);
    console.log('nickname:', nickname);
    console.log('daterehomed:', daterehomed);
    console.log('energylevel:', energylevel);
    console.log('age:', age);
    console.log('sizeweight:', sizeweight);
    console.log('coat:', coat);
    console.log('about:', about);
    console.log('special_needs:', special_needs);
    console.log('med_condition:', med_condition);
    console.log('other_vaccines:', other_vaccines);
    console.log('vaccines:', vaccines);
    console.log('other_sterilization:', other_sterilization);
    console.log('sterilization_id:', sterilization_id);
    console.log('profileUrl:', profileUrl);
    console.log('photoToDelete:', photoToDelete);
    console.log('extraPhotoUrls:', extraPhotoUrls);

    const { data, err } = await supabase.rpc("update_animal_profile_details", {
      _pet_id: pet_id,
      _gender: gender,
      _pet_category_id: pet_category_id,
      _other_pet_category: other_pet_category,
      _breed_id: breed_id,
      _other_breed: other_breed,
      _status: status,
      _name: name,
      _nickname: nickname,
      _daterehomed: daterehomed,
      _energylevel: energylevel,
      _age: age,
      _size_weight: sizeweight,
      _coat: coat,
      _about: about,
      _special_needs: special_needs,
      _med_condition: med_condition,
      _other_vaccines: other_vaccines,
      _vaccines: vaccines,
      _other_sterilization: other_sterilization,
      _sterilization_id: sterilization_id,
      _profile_photo: profileUrl,
      _photo_url_to_delete: photoToDelete,
      _photo_url: extraPhotoUrls,
    });
    if (data) {
      console.log("data here '", data, "' =)")
      return res.status(200).json({
        success: true,
      });
    } else {
      console.log("Error:", err, data, '=)');
    }
  } catch (err) {
    console.log("an error occured when updating", err);
  }
};
const comparePetProfilePhoto = async (oldPhoto) => {
  console.log(oldPhoto);
  const { data, error } = await supabase.storage
    .from("pets_images")
    .remove([oldPhoto]);

  if (error) {
    console.error("Error deleting file:", error);
  } else {
    console.log("File deleted successfully:", data);
  }
};
const comparePetExtraPhoto = async (newPhotos, oldPhotos) => {
  let newPhotosArray = Array.isArray(newPhotos) ? newPhotos : [newPhotos];
  let oldPhotosArray = Array.isArray(oldPhotos) ? oldPhotos : [oldPhotos];

  let filesToDelete = oldPhotosArray.filter(
    (file) => !newPhotosArray.includes(file)
  );

  if (!filesToDelete) {
    filesToDelete = filesToDelete.map((file) =>
      new URL(file).pathname.replace(prefix, "")
    );
    // Ensure filesToDelete is an array and remove those files from Supabase storage
    const { data, error } = await supabase.storage
      .from("pets_images")
      .remove(filesToDelete); // Pass array directly

    if (error) {
      console.error("Err deleting file:", error);
    } else {
      console.log("Files deleted successfully:", data);
    }
  }

  return filesToDelete;
};
//chat
export const searchUser = async (req, res) => {
  const { value } = req.body;
  const { data, error } = await supabase.rpc("search", {
    search_text: value,
  });
  if (error) {
    console.error("Error deleting file 2:", error);
  } else {
    res.status(200).send(data);
  }
};
export const loadInbox = async (req, res) => {
  let { id, chat_id } = req.body;
  id = id.toString();

  if (!chat_id) {
    chat_id = null;
  } else {
    chat_id = chat_id.toString();
  }
  const { data, error } = await supabase.rpc("get_chat_function", {
    user1_id: id,
    _chat_id: chat_id,
  });
  if (error) {
    console.error("Something went wrong getting chat_function", error);
  } else {
    console.log("get chat functon data: ", data);
    res.status(200).send(data);
  }
};
//save message
export const sendMessage = async (req, res) => {
  //here
  console.log("send message function backend");
  const files = req.files;
  const sentimage = files.filter((file) => file.fieldname === "url");
  let extraPhotoUrls = [];

  let url = null;
  let { chat_id, user_id, message, post_id } = req.body;
  post_id = post_id == 'null' || post_id == '' ? null : post_id;
  chat_id = chat_id == 'null' || chat_id == '' ? null : chat_id;
  user_id = user_id == 'null' || user_id == '' ? null : user_id;

  console.log("user_id", user_id);

  try {
    for (const photo of sentimage) {
      const photoPath = `pets_photos/${Date.now()}_${photo.originalname}`;
      const { data: photoUploadData, error: photoUploadError } =
        await supabase.storage
          .from("message_images") // Ensure this is your correct bucket name
          .upload(photoPath, photo.buffer, {
            contentType: photo.mimetype,
          });

      if (!photoUploadError) {
        const { data: photoUrlData } = supabase.storage
          .from("message_images")
          .getPublicUrl(photoPath);
        extraPhotoUrls.push(photoUrlData.publicUrl); // Collecting extra photo URLs
      } else {
        console.error("Extra photo upload error:", photoUploadError);
        return res
          .status(500)
          .send({ message: "Failed to upload extra photos." });
      }
    }
    console.log(extraPhotoUrls);

    if (message == "") {
      message = null;
    }

    if (extraPhotoUrls.length == 0) {
      extraPhotoUrls = null;
    }
    console.log(extraPhotoUrls, message);
    const { data, error } = await supabase.rpc("insert_chat_message", {
      _user_id: user_id,
      _chat_id: chat_id,
      _message: message,
      _photourl: extraPhotoUrls,
      _post_id: post_id,
    });

    if (error) {
      console.error("Error sending message 1:", error);
      res.status(500).send({ success: false, error: error.message });
    } else {
      console.log("success?")
      res.status(200).send({ success: true, url: extraPhotoUrls });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ success: false, error: "Internal server error" });
  }
};
//get full name for sender info
export const getFullName = async (req, res) => {
  const { id } = req.body;

  try {
    const { data, err } = await supabase.rpc("get_user_fullname", {
      _user_id: id,
    });
    if (err) {
      console.error("Error sending message 2:", err);
      res.status(500).send({ success: false, error: err.message });
    } else {
      res.status(200).send(data);
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ success: false, error: "Internal server error" });
  }
};
export const createNewChat = async (req, res) => {
  console.log("create new chat function");
  const { senderid, receiverid } = req.body;
  try {
    console.log("create new chat function", senderid, receiverid);
    const { data, error } = await supabase.rpc("create_chat", {
      p1_id: senderid,
      p2_id: receiverid,
    });
    if (error) {
      console.error("Error sending message 3:", error);
      res.status(500).send({ success: false, error: error.message });
    } else {
      res.status(200).json(data);
      console.log("yipie", data);
    }
  } catch (err) {
    console.log(err);
  }
};

// new added line
// Fetch all shelter details - by salpocial'code
export const getAllShelters = async (req, res) => {
  try {
    // Fetch verified shelters from tbl_shelter
    const { data: shelters, error: sheltersError } = await supabase
      .from("tbl_shelter")
      .select("shelter_id, verified") // Fetch only necessary fields from tbl_shelter
      .eq("verified", true); // Ensure this column exists in tbl_shelter

    if (sheltersError) {
      console.error("Error fetching shelters:", sheltersError);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Now fetch details from tbl_shelter_details
    const shelterIds = shelters.map((shelter) => shelter.shelter_id);
    const { data: shelterDetails, error: detailsError } = await supabase
      .from("tbl_shelter_details")
      .select("shelter_id, shelter_name, latitude, longitude, address")
      .in("shelter_id", shelterIds); // Get details for the verified shelters

    if (detailsError) {
      console.error("Error fetching shelter details:", detailsError);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Combine shelters and their details
    const combinedData = shelters.map((shelter) => {
      const details = shelterDetails.find(
        (detail) => detail.shelter_id === shelter.shelter_id
      );
      return {
        ...shelter,
        ...details, // Merge details with shelter data
      };
    });

    res.status(200).json(combinedData);
  } catch (err) {
    ``;
    console.error("Error in getAllShelters:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// end of added from salpocial's code

//fetch reports in shelter
export const retrieveReports = async (req, res) => {
  try {
    let { _post_id, _post_type, _user_id, _report_status } = req.body;

    _post_id = _post_id == null || _post_id == '' ? null : _post_id;
    _user_id = (_user_id == null || _user_id == '') ? null : _user_id
    _post_type = (_post_type == null || _post_type == '') ? null : _post_type
    _report_status = (_report_status == null || _report_status == '') ? null : _report_status

    console.log("here", _post_id, _post_type, _user_id);
    const { data, error } = await supabase.rpc("get_filtered_posts", {
      _post_id: _post_id,
      _post_type: _post_type,
      _user_id: _user_id,
      _report_status: _report_status,
    });
    if (!error) {
      res.status(200).send(data);
    } else {
    }
  } catch (err) {
    console.log("error occured in retrieveReports", err);
  }
};

export const retrieveEvents = async (req, res) => {
  try {
    let { _event_id, _shelter_id } = req.body;

    _event_id = _event_id == null || _event_id == "" ? null : _event_id;
    _shelter_id = _shelter_id == null || _shelter_id == "" ? null : _shelter_id;

    const { data, error } = await supabase.rpc("get_events_by_shelter", {
      _shelter_id: _shelter_id,
      _event_id: _event_id,
    });
    if (!error) {
      res.status(200).send(data);
    } else {
      res.status(500).send({
        success: false,
        error: error.message,
        message: "An Error Occured",
      });
    }
  } catch (err) {
    console.log("an error occured in the backend | retrieve Events");
  }
};
export default { addShelterAddress };

// Nov5 start of salpocial's code
// Add new shelter post
export const addShelterPost = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Received files:", req.files);

    // Extract and parse parameters
    let user_id = parseInt(req.body.user_id);
    let pet_id = req.body.pet_id === "" ? null : parseInt(req.body.pet_id); // Handle empty string
    const { content } = req.body;
    const files = req.files;

    console.log("Parsed data:", {
      user_id,
      pet_id,
      content,
      filesCount: files ? files.length : 0,
    });

    // Check for required fields
    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "User  ID is required" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Each post must contain at least one photo.",
      });
    }

    // Handle file uploads
    const photoUrls = [];
    for (const file of files) {
      const filePath = `post_photos/${Date.now()}_${file.originalname}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("pets_images")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("pets_images")
        .getPublicUrl(filePath);

      photoUrls.push(urlData.publicUrl);
    }

    // Set report status to "Pending"
    const reportStatus = "Pending";

    // Insert post
    const { data, error } = await supabase.rpc("insert_post_with_details", {
      _user_id: user_id,
      _post_type: 1,
      _content: content,
      _lat: null,
      _long: null,
      _address: null,
      _pet_condition: null,
      _photo_urls: photoUrls,
      _pet_category: null,
      _other_pet_category: null,
      _pet_id: pet_id,
      _report_status: null, // Pass the report status here
    });

    if (error) throw error;

    res
      .status(200)
      .json({ success: true, message: "Post created successfully" });
  } catch (err) {
    console.error("Error in addShelterPost:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create post",
    });
  }
};


export const foundRescue = async (req, res) => {
  try {
    const { post_id, user_id, status } = req.body;
    console.log("status", status)
    // First, update the report status in tbl_post_details

    const { data: handlerData, error: handlerError } = await supabase //insert to tbl_report_handler
      .from("tbl_report_handler")
      .insert([
        {
          post_id: post_id,
          handled_by: user_id,
        },
      ]);

    if (handlerError) {
      console.error("Error creating handler record:", handlerError);
      return res
        .status(500)
        .json({ success: false, message: "Failed to create handler record" });
    } else {
      const { data: updateData, error: updateError } = await supabase //update in post_Details
        .from("tbl_post_details")
        .update({ report_status: status }) // Nov12 "Pending" change to "In progress"
        .eq("post_id", post_id);

      if (updateError) {
        console.error("Error updating record:", handlerError);
        return res
          .status(500)
          .json({ success: false, message: "Failed to update record" });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Report ${status === "Rescued" ? "Accepted" : "Cancelled"
        } successfully`,
    });
  } catch (err) {
    console.error("Error in acceptRescueReport:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
// This is the function for accepting rescue reports
export const acceptRescueReport = async (req, res) => {
  try {
    const { post_id, user_id, status } = req.body;
    console.log("status", status)
    // First, update the report status in tbl_post_details

    const { data: handlerData, error: handlerError } = await supabase //insert to tbl_report_handler
      .from("tbl_report_handler")
      .insert([
        {
          post_id: post_id,
          handled_by: user_id,
        },
      ]);

    if (handlerError) {
      console.error("Error creating handler record:", handlerError);
      return res
        .status(500)
        .json({ success: false, message: "Failed to create handler record" });
    } else {
      const { data: updateData, error: updateError } = await supabase //update in post_Details
        .from("tbl_post_details")
        .update({ report_status: status }) // Nov12 "Pending" change to "In progress"
        .eq("post_id", post_id);

      if (updateError) {
        console.error("Error updating record:", handlerError);
        return res
          .status(500)
          .json({ success: false, message: "Failed to update record" });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Report ${status === "Rescued" ? "Accepted" : "Cancelled"
        } successfully`,
    });
  } catch (err) {
    console.error("Error in acceptRescueReport:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const confirmRescue = async (req, res) => {
  try {
    const { post_id, shelter_id } = req.body;
    // First, update the report status in tbl_post_details
    const { data: updateData, error: updateError } = await supabase
      .from("tbl_post_details")
      .update({ report_status: "Rescued" })
      .eq("post_id", post_id);

    if (updateError) {
      console.error("Error updating report status:", updateError);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update report status" });
    }

    return res.status(200).json({
      success: true,
      message: `Rescued successfully`,
    });
  } catch (err) {
    console.error("Error in acceptRescueReport:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
// export const cancelOperation = async (req, res) => {
//   try {
//     const { _shelter_id, _post_id } = req.body;

//     const { data, error } = await supabase.rpc("cancel_operation", {
//       input_handled_by: _shelter_id,
//       input_post_id: _post_id,
//     });
//     if (!error) {
//       res.status(200).send({ success: true });
//     } else {
//       res
//         .status(500)
//         .send({
//           success: false,
//           error: error.message,
//           message: "An Error Occured",
//         });
//     }
//   } catch (err) {
//     console.log("An error occured: Cancel Operation", err);
//   }
// }; comment on Nov12

// Nov12 Replacement based on Salpocials code
export const cancelOperation = async (req, res) => {
  try {
    const { _post_id, _user_id } = req.body; // Assuming you only need the post_id to update the status

    // Update the report_status to 'Pending' in the tbl_post_details table
    const { data: updateData, error: updateError } = await supabase
      .from("tbl_post_details")
      .update({ report_status: "Pending" })
      .eq("post_id", _post_id);

    if (updateError) {
      console.error("Error updating report status:", updateError);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update report status" });
    }
    else {
      const { data: updateData, error: updateError } = await supabase
        .from("tbl_report_handler")
        .update({ cancelled: true }) // Ensure 'cancelled' matches your database column name
        .eq("post_id", _post_id) // Replace _post_id with the variable holding the desired post ID
        .eq("handled_by", _user_id); // Replace user_id with the variable holding the desired user ID

    }
    return res
      .status(200)
      .json({ success: true, message: "Operation cancelled successfully" });
  } catch (err) {
    console.error("Error in cancelOperation:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
// end of new added replacement

// Create new event function
export const addShelterEvent = async (req, res) => {
  try {
    console.log("Received event data:", req.body);
    console.log("Received files:", req.files);

    let {
      host_id,
      event_name,
      date_time_start,
      date_time_end,
      location_lat,
      location_long,
      caption,
      location_address,
    } = req.body;
    const files = req.files;
    let photoUrls = [];

    caption = caption == 'null' || caption == '' ? null : caption
    photoUrls = photoUrls == 'null' || photoUrls == 'undefined' || photoUrls == '' ? [] : photoUrls
    // Handle multiple file uploads
    if (files && files.length > 0) {
      for (const photo of files) {
        const photoPath = `events/${Date.now()}_${photo.originalname}`;

        console.log("Uploading photo:", photoPath);

        const { data: photoUploadData, error: photoUploadError } =
          await supabase.storage
            .from("pets_images")
            .upload(photoPath, photo.buffer, {
              contentType: photo.mimetype,
            });

        if (!photoUploadError) {
          const { data: photoUrlData } = supabase.storage
            .from("pets_images")
            .getPublicUrl(photoPath);
          photoUrls.push(photoUrlData.publicUrl);
          console.log("Photo uploaded successfully:", photoUrlData.publicUrl);
        } else {
          console.error("Photo upload error:", photoUploadError);
          return res
            .status(500)
            .send({ message: "Failed to upload event photo." });
        }
      }
    }

    console.log("Inserting event into database");
    console.log(photoUrls);
    // Insert into tbl_events
    const { data, error } = await supabase.rpc("insert_event", {
      _host_id: parseInt(host_id),
      _event_name: event_name,
      _date_time_start: date_time_start,
      _date_time_end: date_time_end,
      _lat: parseFloat(location_lat),
      _long: parseFloat(location_long),
      _caption: caption,
      _photo_url: photoUrls,
      _location_address: location_address
    });


    // from("tbl_events").insert([
    //   {
    //     host_id: parseInt(host_id),
    //     event_name: event_name,
    //     date_time_start: date_time_start,
    //     date_time_end: date_time_end,
    //     location_lat: parseFloat(location_lat),
    //     location_long: parseFloat(location_long),
    //     caption: caption,
    //     photo_display_url: photoUrls, // Store array of URLs
    //   },
    // ]);

    if (error) {
      console.error("Database insert error:", error);
      return res.status(500).send({
        success: false,
        message: "Failed to create event",
        error: error.message,
      });
    }

    res.status(200).send({
      success: true,
      message: "Event created successfully",
      photoUrls: photoUrls,
    });
  } catch (err) {
    console.error("Error in addShelterEvent:", err);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
export const setShelterEvent = async (req, res) => {
  try {
    console.log("Received event data:", req.body);
    console.log("Received files:", req.files);

    let {
      host_id,
      event_name,
      date_time_start,
      date_time_end,
      location_lat,
      location_long,
      caption,
      location_address,
      eventid,
      imgurl
    } = req.body;
    const files = req.files;
    let photoUrls = [];

    caption = caption == 'null' || caption == '' ? null : caption
    photoUrls = photoUrls == 'null' || photoUrls == 'undefined' || photoUrls == '' ? [] : photoUrls

    // Handle multiple file uploads
    if (files && files.length > 0) {
      for (const photo of files) {
        const photoPath = `events/${Date.now()}_${photo.originalname}`;

        const { data: photoUploadData, error: photoUploadError } =
          await supabase.storage
            .from("pets_images")
            .upload(photoPath, photo.buffer, {
              contentType: photo.mimetype,
            });

        if (!photoUploadError) {
          const { data: photoUrlData } = supabase.storage
            .from("pets_images")
            .getPublicUrl(photoPath);
          photoUrls.push(photoUrlData.publicUrl);
          console.log("Photo uploaded successfully:", photoUrlData.publicUrl);
        } else {
          console.error("Photo upload error:", photoUploadError);
          return res
            .status(500)
            .send({ message: "Failed to upload event photo." });
        }
      }
    }

    console.log("Inserting event into database");
    if (photoUrls.length < 1) {
      console.log("url", photoUrls)
      photoUrls.push(imgurl)
    }
    else {

      console.log("?")
    }
    console.log("url", photoUrls)
    // Insert into tbl_events
    const { data, error } = await supabase.rpc("modify_event", {
      _event_id: eventid,
      _host_id: parseInt(host_id),
      _event_name: event_name,
      _date_time_start: date_time_start,
      _date_time_end: date_time_end,
      _lat: parseFloat(location_lat),
      _long: parseFloat(location_long),
      _caption: caption,
      _photo_url: photoUrls,
      _location_address: location_address
    });

    if (error) {
      console.error("Database insert error:", error);
      return res.status(500).send({
        success: false,
        message: "Failed to create event",
        error: error.message,
      });
    }

    res.status(200).send({
      success: true,
      message: "Event created successfully",
      photoUrls: photoUrls,
    });
  } catch (err) {
    console.error("Error in addShelterEvent:", err);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
export const getOngoingOperations = async (req, res) => {
  try {
    const { _shelter_id, _status } = req.body;

    const { data, error } = await supabase.rpc("get_handled_reports", {
      handled_by_id: _shelter_id,
      _status: _status,
    });
    if (!error) {
      res.status(200).send(data);
    } else {
      res.status(500).send({
        success: false,
        error: error.message,
        message: "An Error Occured",
      });
    }
  } catch (err) {
    console.log("error in backend: getongoingoperations", err)
  }
};
export const getRescuedHistory = async (req, res) => {
  try {
    const { _report_status, _handled_by } = req.body;

    const { data, error } = await supabase.rpc("get_rescued_reports", {
      _report_status: _report_status,
      _handled_by: _handled_by,
    });
    if (!error) {
      res.status(200).send(data);
    } else {
      res.status(500).send({
        success: false,
        error: error.message,
        message: "An Error Occured",
      });
    }
  } catch (err) {
    console.log("error in backend: getongoingoperations", err)
  }
}
