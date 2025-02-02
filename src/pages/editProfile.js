import React, { useState } from 'react';
import { ChakraProvider, Box, Button, Input, Textarea, FormControl, FormLabel } from '@chakra-ui/react';
import ResponsiveContainer from "../Components/ResponsiveContainers";
import ImageBackground from "../Components/Background";
import ProfileHeader from "../Components/ProfileHeader";
import ProfileImage from "../Components/Profile/ProfileImage";
import ProfileName from "../Components/Profile/ProfileName";
import BodyBold from "../Components/BodyBold";
import OccupationText from "../Components/OccupationText";
import PersonalInfo from "../Components/Profile/PersonalInfo";
import axios from "axios"; // For API requests
import { jwtDecode } from 'jwt-decode'; // To decode the JWT token
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    phone: '',
    occupation: '',
    interests: '',
    aboutMe: '',
    imageUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // To handle form submission status

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit form data to the database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the JWT token from localStorage
      const token = localStorage.getItem('token'); // Ensure you're using the correct token key

      console.log("Retrieved Token: ", token);  // Log token to ensure it's retrieved properly

      if (!token) {
        alert("No authentication token found. Please log in.");
        return;
      }

      // Decode the token to check its expiry
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded); // Log decoded token to check expiration date

      // Optionally, check if the token is expired
      if (decoded.exp * 1000 < Date.now()) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem('token'); // Remove expired token
        return;
      }

      // Send the request with the token in the Authorization header
      await axios.post('http://localhost:5000/api/userdata', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the JWT token to the request header
        },
      });

      alert('Userdata added successfully!');
      setFormData({ // Reset form after submission
        name: '',
        dob: '',
        email: '',
        phone: '',
        occupation: '',
        interests: '',
        aboutMe: '',
        imageUrl: '',
      });
    } catch (error) {
      console.error('Error adding userdata:', error);
      alert('Failed to add userdata. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    alert("You have been logged out.");
    router.push("/"); // Redirect to the login page (React Router v6)
  };


  return (
    <ChakraProvider>
      <Box position="fixed" top={0} left={0} width="100%" height="100%" zIndex={-1}>
        <ImageBackground />
      </Box>
      <ResponsiveContainer>
        <ProfileHeader />

        {/* Add Userdata Section */}
        <Box mt="20px" p="20px" bg="white" borderRadius="10px" shadow="lg">
          <BodyBold>Add Userdata</BodyBold>
          <form onSubmit={handleSubmit}>
            <FormControl mt="4">
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                isRequired
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                isRequired
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                isRequired
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                isRequired
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Occupation</FormLabel>
              <Input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                placeholder="Enter your occupation"
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Interests</FormLabel>
              <Textarea
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                placeholder="Enter interests (comma-separated)"
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>About Me</FormLabel>
              <Textarea
                name="aboutMe"
                value={formData.aboutMe}
                onChange={handleInputChange}
                placeholder="Write something about yourself"
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Image URL</FormLabel>
              <Input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="Enter an image URL"
              />
            </FormControl>
            <Button
              mt="6"
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
            >
              Edit Information
            </Button>
          </form>
        </Box>

        {/* Logout Button */}
        <Button
          mt="6"
          colorScheme="red"
          onClick={handleLogout}
        >
          Logout
        </Button>

        {/* Existing Sections */}
        <ProfileImage imagePaths={['/images/001.png']} />
        <ProfileName>Bernard Okuku</ProfileName>
        <OccupationText>Structural Engineer</OccupationText>
        <PersonalInfo label="Email:" value="kajwangeinstein@gmail.com" />
      </ResponsiveContainer>
    </ChakraProvider>
  );
};

export default Index;
