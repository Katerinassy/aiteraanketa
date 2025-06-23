import React, { useState, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import FormSection from "./components/FormSection";
import PhotoUpload from "./components/PhotoUpload";
import "./styles.css";

const App = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    birthDate: "",
    age: "",
    citizenship: "",
    address: "",
    institution: "",
    specialty: "",
    course: "",
    studyForm: "",
    gpa: "",
    studyInterest: "",
    howKnow: "",
    practiceBenefits: "",
    previousPractice: "",
    internetResearch: "",
    clientOrders: "",
    teamwork: "",
    practiceExpectations: "",
    supplierMonitoring: "",
    skills: [],
    practiceActivities: "",
    hobbies: "",
    practicalExperience: "",
    professionalTasks: "",
    socialMedia: "",
    futureVision: "",
    exhibitions: "",
    adDesign: "",
    printMaterials: "",
    creativeConcepts: "",
    threeDExperience: "",
    printPrep: "",
    multitasking: "",
    emailCampaigns: "",
    coldCalling: "",
    contractExperience: "",
    excelSkills: "",
    printerSkills: "",
    souvenirs: "",
    writingExperience: "",
    editingSkills: "",
    logoDesign: "",
    magazineCovers: "",
    businessCards: "",
    workExperience: "",
    previousJobs: "",
    likesToDo: "",
    interestedInJob: "",
    internshipPeriod: "",
    submissionDate: "",
    signature: "",
    interviewer: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const ageDiff = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDiff);
      const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      setFormData((prev) => ({ ...prev, age: calculatedAge }));
    }
  }, [formData.birthDate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        skills: checked
          ? [...prev.skills, value]
          : prev.skills.filter((skill) => skill !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = (photo) => {
    setFormData((prev) => ({ ...prev, photo }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Ф.И.О. обязательно";
    if (!formData.phone.trim())
      newErrors.phone = "Контактный телефон обязателен";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setIsSubmitting(true);
  try {
    // Convert photo to Base64 if exists
    let photoBase64 = null;
    if (formData.photo) {
      photoBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(formData.photo);
      });
    }

    // Prepare data for sending
    const dataToSend = {
      ...formData,
      photo: photoBase64,
      skills: formData.skills // already an array
    };

    await axios.post(
      "http://localhost:3001/api/application",
      dataToSend,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  } catch (error) {
    console.error("Ошибка при отправке формы:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  const generatePDF = () => {
    const element = document.getElementById("internForm");
    const opt = {
      margin: 10,
      filename: `Анкета_${formData.fullName || "студента"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  const sections = [
    {
      title: "Личная информация",
      fields: [
        { id: "fullName", label: "Ф.И.О. *", type: "text", required: true },
        {
          id: "phone",
          label: "Контактный телефон *",
          type: "tel",
          required: true,
        },
        { id: "birthDate", label: "Дата рождения", type: "date" },
        {
          id: "age",
          label: "Сколько Вам полных лет?",
          type: "number",
          readOnly: true,
        },
        { id: "citizenship", label: "Гражданство", type: "text" },
        {
          id: "address",
          label: "Адрес проживания, ближайшее метро",
          type: "text",
        },
      ],
    },
    {
      title: "Образование",
      fields: [
        {
          id: "institution",
          label: "Наименование учебного заведения",
          type: "text",
        },
        { id: "specialty", label: "Специальность", type: "text" },
        { id: "course", label: "Курс", type: "number", min: 1, max: 6 },
        {
          id: "studyForm",
          label: "Форма обучения",
          type: "select",
          options: [
            { value: "", label: "Выберите форму обучения" },
            { value: "Очная", label: "Очная" },
            { value: "Очно-заочная", label: "Очно-заочная" },
            { value: "Заочная", label: "Заочная" },
            { value: "Дистанционная", label: "Дистанционная" },
          ],
        },
        {
          id: "gpa",
          label: "Средний балл",
          type: "number",
          step: 0.1,
          min: 0,
          max: 5,
        },
        {
          id: "studyInterest",
          label: "Вам интересно учиться?",
          type: "textarea",
        },
      ],
    },
    {
      title: "Информация о практике",
      fields: [
        { id: "howKnow", label: "Как вы узнали о нас?", type: "textarea" },
        {
          id: "practiceBenefits",
          label: "Какие преимущества Вы видите в стажировке у нас?",
          type: "textarea",
        },
        {
          id: "previousPractice",
          label: "Проходили ли вы практику ранее?",
          type: "textarea",
        },
        {
          id: "internetResearch",
          label: "Вы работали с поиском информации в интернете?",
          type: "textarea",
        },
        {
          id: "clientOrders",
          label: "Вы рассчитывали когда-нибудь заказы клиентов?",
          type: "textarea",
        },
        {
          id: "teamwork",
          label: "Любите ли Вы работать в команде?",
          type: "select",
          options: [
            { value: "", label: "Выберите ответ" },
            { value: "Да", label: "Да" },
            { value: "Нет", label: "Нет" },
            { value: "Иногда", label: "Иногда" },
          ],
        },
        {
          id: "practiceExpectations",
          label: "Что Вы хотите получить от практики?",
          type: "textarea",
        },
        {
          id: "supplierMonitoring",
          label: "Проводили ли Вы мониторинг поставщиков в интернете?",
          type: "select",
          options: [
            { value: "", label: "Выберите ответ" },
            { value: "Да", label: "Да" },
            { value: "Нет", label: "Нет" },
          ],
        },
      ],
    },
    {
      title: "Навыки и умения",
      fields: [
        {
          id: "skills",
          label: "Какими программами Вы владеете:",
          type: "skills",
          options: [
            { value: "PowerPoint", label: "PowerPoint" },
            { value: "Outlook", label: "Outlook" },
            { value: "Excel", label: "Excel" },
            { value: "Word", label: "Word" },
            { value: "1С", label: "1С" },
            { value: "Illustrator", label: "Illustrator" },
            { value: "Photoshop", label: "Photoshop" },
            { value: "Corel Draw", label: "Corel Draw" },
          ],
        },
        {
          id: "practiceActivities",
          label: "Чем бы Вы хотели заниматься на практике?",
          type: "textarea",
        },
        { id: "hobbies", label: "Есть ли у Вас хобби?", type: "textarea" },
        {
          id: "practicalExperience",
          label: "Каким практическим опытом Вы обладаете?",
          type: "textarea",
        },
        {
          id: "professionalTasks",
          label:
            "Какие профессиональные задачи Вы способны решать наиболее компетентно?",
          type: "textarea",
        },
        {
          id: "socialMedia",
          label:
            "Как Вы относитесь к социальным сетям, сколько времени проводите в них?",
          type: "textarea",
        },
        {
          id: "futureVision",
          label: "Кем Вы себя видите через год?",
          type: "textarea",
        },
        {
          id: "exhibitions",
          label: "Принимали ли Вы участие в выставках? В качестве кого?",
          type: "textarea",
        },
        {
          id: "adDesign",
          label:
            "Вы когда-нибудь подготавливали рекламные макеты к производству?",
          type: "textarea",
        },
        {
          id: "printMaterials",
          label: "Занимались ли Вы оформлением полиграфических материалов?",
          type: "select",
          options: [
            { value: "", label: "Выберите ответ" },
            { value: "Да", label: "Да" },
            { value: "Нет", label: "Нет" },
          ],
        },
        {
          id: "creativeConcepts",
          label:
            "Вы когда-нибудь занимались разработкой креативных концепций, фирменного стиля?",
          type: "textarea",
        },
        {
          id: "threeDExperience",
          label: "Работали ли Вы с 3D пакетом?",
          type: "textarea",
        },
        {
          id: "printPrep",
          label:
            "Владеете ли Вы техникой на уровне печатной подготовки и цветоделения?",
          type: "textarea",
        },
        {
          id: "multitasking",
          label:
            "Умеете ли Вы работать над несколькими проектами одновременно?",
          type: "select",
          options: [
            { value: "", label: "Выберите ответ" },
            { value: "Да", label: "Да" },
            { value: "Нет", label: "Нет" },
          ],
        },
        {
          id: "emailCampaigns",
          label: "Делали ли Вы email рассылки?",
          type: "select",
          options: [
            { value: "", label: "Выберите ответ" },
            { value: "Да", label: "Да" },
            { value: "Нет", label: "Нет" },
          ],
        },
        {
          id: "coldCalling",
          label: "Занимались ли Вы когда-либо обзвоном клиентов?",
          type: "select",
          options: [
            { value: "", label: "Выберите ответ" },
            { value: "Да", label: "Да" },
            { value: "Нет", label: "Нет" },
          ],
        },
        {
          id: "contractExperience",
          label: "Есть ли у Вас опыт в оформлении договора?",
          type: "textarea",
        },
        {
          id: "excelSkills",
          label: "Насколько хорошо Вы работаете с Excel?",
          type: "select",
          options: [
            { value: "", label: "Выберите уровень" },
            { value: "Базовый", label: "Базовый" },
            { value: "Средний", label: "Средний" },
            { value: "Продвинутый", label: "Продвинутый" },
            { value: "Эксперт", label: "Эксперт" },
          ],
        },
        {
          id: "printerSkills",
          label: "Умеете ли Вы пользоваться принтером?",
          type: "textarea",
        },
        {
          id: "souvenirs",
          label: "Вы работали когда-нибудь с сувенирной продукцией?",
          type: "textarea",
        },
        {
          id: "writingExperience",
          label: "Есть ли у Вас опыт написания текстов?",
          type: "textarea",
        },
        {
          id: "editingSkills",
          label: "Умеете ли Вы корректировать текст?",
          type: "select",
          options: [
            { value: "", label: "Выберите ответ" },
            { value: "Да", label: "Да" },
            { value: "Нет", label: "Нет" },
          ],
        },
        {
          id: "logoDesign",
          label: "Вы когда-нибудь создавали логотип?",
          type: "textarea",
        },
        {
          id: "magazineCovers",
          label: "Делали ли Вы когда-либо обложки журналов?",
          type: "textarea",
        },
        {
          id: "businessCards",
          label: "Вы когда-нибудь изготавливали визитки для предприятия?",
          type: "select",
          options: [
            { value: "", label: "Выберите ответ" },
            { value: "Да", label: "Да" },
            { value: "Нет", label: "Нет" },
          ],
        },
      ],
    },
    {
      title: "Опыт работы",
      fields: [
        {
          id: "workExperience",
          label: "Работали ли Вы ранее?",
          type: "select",
          options: [
            { value: "", label: "Выберите ответ" },
            { value: "Да", label: "Да" },
            { value: "Нет", label: "Нет" },
          ],
        },
        {
          id: "previousJobs",
          label: "Если да, то где и кем работали?",
          type: "textarea",
        },
        {
          id: "likesToDo",
          label: "Чем Вам нравится заниматься?",
          type: "textarea",
        },
        {
          id: "interestedInJob",
          label: "Заинтересованы ли Вы в работе после окончания практики?",
          type: "select",
          options: [
            { value: "", label: "Выберите ответ" },
            { value: "Да", label: "Да" },
            { value: "Нет", label: "Нет" },
            { value: "Возможно", label: "Возможно" },
          ],
        },
        {
          id: "internshipPeriod",
          label: "Укажите период стажировки",
          type: "text",
        },
      ],
    },
    {
      title: "Заключение",
      fields: [
        { id: "submissionDate", label: "Дата", type: "date" },
        { id: "signature", label: "Подпись", type: "text" },
        {
          id: "interviewer",
          label: "Кто проводил собеседование",
          type: "text",
        },
      ],
    },
  ];

  return (
    <div className="container">
      <div id="internForm">
        <div className="photo-placeholder">
          <PhotoUpload onPhotoUpload={handlePhotoUpload} />
        </div>
        <h1>Анкета для студентов-практикантов</h1>

        <form onSubmit={handleSubmit}>
          {sections.map((section, index) => (
            <FormSection
              key={index}
              title={section.title}
              fields={section.fields}
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />
          ))}

          <div className="buttons">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Отправка..." : "Отправить анкету"}
            </button>
            <button type="button" onClick={generatePDF}>
              Сохранить PDF
            </button>
          </div>
        </form>

        {submitSuccess && (
          <div className="success-message">Анкета успешно отправлена!</div>
        )}
      </div>
    </div>
  );
};

export default App;
