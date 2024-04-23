import React from "react";
import { Image, Spinner } from "react-bootstrap";

const blendedQuotes = [
    "Blended learning gives students more flexibility in their schedules for these obligations because a significant portion of course time is devoted to online activities, allowing them to study when and where it is most convenient.",
    "The concept of blended learning has been around since the late 1990s, but its popularity has grown significantly in recent years due to advancements in technology and the increasing demand for flexible education.",
    "Blended learning allows students to take advantage of the best aspects of both online and in-person learning, creating a more well-rounded and engaging educational experience.",
    "Research shows that blended learning can lead to improved learning outcomes, as it enables students to work at their own pace, review material as needed, and receive individualized attention from teachers.",
    "One of the key benefits of blended learning is its ability to accommodate diverse learning styles, allowing students to choose the most effective methods for their own learning preferences.",
    "Blended learning can be particularly beneficial for students who have other commitments, such as part-time jobs or family responsibilities, as it provides greater flexibility in managing their time.",
    "With blended learning, teachers can use data analytics to track students' progress and identify areas where they may need additional support, allowing for more targeted interventions.",
    "Many educational institutions and schools have embraced blended learning models, and some have even adopted a 'flipped classroom' approach, where students watch instructional videos online before coming to class for interactive discussions and activities.",
    "Blended learning is not limited to K-12 or higher education; it has also been successfully implemented in corporate training and professional development programs.",
    "The COVID-19 pandemic further highlighted the importance of blended learning as a way to ensure continuity in education when traditional in-person instruction is disrupted.",
    "Blended learning can be adapted to various subjects and disciplines, making it a versatile approach that can benefit students across different academic areas.",
    "Some blended learning platforms incorporate gamification elements, making the learning process more enjoyable and motivating for students.",
    "Blended learning fosters digital literacy skills, as students need to navigate online resources, collaborate in virtual environments, and use various digital tools for their coursework.",
    "Teachers in blended learning environments often take on the role of facilitators and mentors, guiding students through the learning process and offering personalized support.",
    "Blended learning can promote a sense of ownership and responsibility in students, as they have more control over their learning journey and outcomes.",
    "The flexibility of blended learning also extends to teachers, as they can use their creativity to design engaging online content and interactive activities."
]

const edutalimQuotes = [
  "At EduTalim, we empower learners to shape their future with expert tutors, innovative techniques, and certified courses, fostering a community of skills and innovation.",
  "EduTalim: Where knowledge meets opportunity. Join us in the pursuit of excellence and let your skills pave the way for a successful career.",
  "With EduTalim, discover a world of learning where industry experts guide your journey, offering SSLC, +2, UG & PG programs designed for a future of limitless possibilities.",
  "EduTalim opens doors to boundless opportunities. Our expert faculties and accredited courses ensure your education journey is supported by excellence and innovation.",
  "Explore the realms of knowledge at EduTalim, where every course is a step toward a brighter future. Let our expertise and your passion drive your success story.",
  "At EduTalim, education is not just a process; it's a transformative experience. Join us, and let your aspirations meet our expertise to create a future of endless achievements.",
  "EduTalim: Nurturing talent, fostering innovation. Our programs, guided by industry leaders, provide the foundation for a successful and fulfilling career journey.",
  "With EduTalim, education becomes a personalized journey. Our courses, designed by experts, cater to your interests, ensuring your path to success is as unique as you are.",
  "Embark on a learning adventure with EduTalim. Our accredited programs and dedicated tutors create a supportive environment for you to explore, learn, and excel.",
  "EduTalim is not just an education platform; it's a gateway to a world of opportunities. Join us, and let your ambitions take flight with our industry-backed programs.",
  "EduTalim: Bridging dreams and careers. Our expert team and diverse courses prepare you for a future where your skills are your best assets. Unlock your potential with us.",
  "At EduTalim, we believe in empowering dreams. Our courses, led by industry experts, provide the knowledge and skills needed to turn aspirations into achievements.",
  "Join EduTalim and embark on a transformative learning journey. Our programs, validated by industry leaders, equip you with the expertise needed for a successful career.",
  "EduTalim: Where education meets innovation. Our forward-thinking programs, supported by expert tutors, prepare you for a future where your skills shape industries.",
  "Discover the EduTalim advantage – where quality education meets passion-driven learning. Let our expert tutors and accredited courses guide you toward a future of endless possibilities."
]



const get_sub_org_array = window.location.href.split('.');
var displayQuotes;

if(get_sub_org_array.includes('blend-ed')){
  displayQuotes = blendedQuotes;
}else if(get_sub_org_array.includes('edutalim')){
  displayQuotes = edutalimQuotes;
}else{
  displayQuotes = blendedQuotes;
}


export const Loading = () => (
  
  <div className="text-center position-relative" style={{height: (window.location.pathname.includes('academics') || window.location.pathname.includes('learn')) ? '75vh' : '100vh'}}>
    <div className="position-absolute top-50 start-50 translate-middle">
      <h2 className="text-dark fw-medium">Did you know?</h2>
      <p>
        { displayQuotes[Math.floor(Math.random() * displayQuotes.length)]}
      </p>
    </div>
    <div className="d-flex align-items-center position-absolute bottom-0 start-50 translate-middle-x mb-6">
      <Spinner animation="grow" size="sm" variant="dark" role="status" />
      <span className="ms-2 fw-medium text-dark">Loading</span>
    </div>
  </div>
);
