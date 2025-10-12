# Onye FHIR Data Query System

A modern, user-friendly web application for querying and visualizing FHIR (Fast Healthcare Interoperability Resources) data. Built with Next.js, TypeScript, and Tailwind CSS, this application provides an intuitive interface for healthcare professionals to search, filter, and analyze patient records, observations, and medical conditions.

![Onye Logo](public/onye_logo.svg)

## 🌟 Features

### Core Functionality
- **Natural Language Query** - Search using plain English queries like "Find all patients" or "Show blood pressure observations"
- **Real-time Search** - Instant results with simulated FHIR data responses
- **Multiple Resource Types** - Support for Patients, Observations, and Conditions
- **Quick Query Buttons** - Pre-defined queries for common searches

### Data Visualization
- **Interactive Charts** 
  - Bar charts for age distribution, observation values, and severity levels
  - Pie charts with percentage breakdowns
  - Responsive design that adapts to screen sizes
- **Data Tables** - Comprehensive tabular views with sortable columns
- **Card Views** - Detailed individual record cards with all information

### Advanced Filtering
- **Patient Filters**
  - Age range filtering (0-29, 30-39, 40-49, 50+)
  - Gender filtering (Male/Female)
- **Condition Filters**
  - Diagnosis code search (e.g., E11, I10, J45.0)
  - Severity filtering (Mild, Moderate, Severe)
- **Real-time Updates** - Filters update visualizations and tables instantly

### User Experience
- **Onye Branding** - Professional healthcare design with teal/cyan color scheme
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile devices
- **Accessible UI** - High contrast, clear typography using Quicksand font
- **Loading States** - Visual feedback during data fetching
- **Empty States** - Helpful messages when no results are found

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/beloveddie/OnyeFrontend.git
   cd OnyeFrontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main application component
│   │   ├── layout.tsx        # Root layout with Quicksand font
│   │   ├── globals.css       # Global styles and animations
│   │   └── favicon.ico       # Application icon
│   └── ...
├── public/
│   ├── onye_logo.svg         # Onye brand logo
│   └── ...
├── package.json              # Dependencies and scripts
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── tailwind.config.ts        # Tailwind CSS configuration
```

## 🛠️ Technologies Used

### Frontend Framework
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Google Fonts** - Quicksand font family
- **Custom CSS Animations** - Blob effects and transitions

### Data Visualization
- **Recharts** - Composable charting library
  - Bar charts
  - Pie charts
  - Responsive containers
  - Interactive tooltips

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundler for development

## 📊 FHIR Data Types

### Patients
- Patient ID
- Name
- Age
- Gender
- Birth Date
- Address
- Phone Number

### Observations
- Observation ID
- Patient ID
- Type (Blood Pressure, Heart Rate, Temperature)
- Value with Unit
- Date
- Status

### Conditions
- Condition ID
- Patient ID
- ICD Code
- Description
- Severity Level
- Onset Date

## 🎨 Design System

### Colors
- **Primary**: Teal (#14B8A6, #5ABCB9)
- **Secondary**: Cyan (#06B6D4)
- **Accent**: Rose (#E74C60) for conditions
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font Family**: Quicksand (300, 400, 500, 600, 700)
- **Headings**: Bold, large sizes
- **Body**: Regular weight, readable sizes

### Components
- **Rounded Corners**: 2xl for cards, full for buttons
- **Shadows**: Soft shadows with hover effects
- **Transitions**: Smooth color and shadow transitions

## 🔍 Query Examples

### Patient Queries
- "Find all patients"
- "Show patients"
- "Who are the patients?"

### Observation Queries
- "Show blood pressure observations"
- "Display vital signs"
- "List all observations"

### Condition Queries
- "List all conditions"
- "Show diagnoses"
- "Display diseases"

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Future Enhancements

- [ ] Backend API integration with real FHIR server
- [ ] User authentication and authorization
- [ ] Export data to CSV/PDF
- [ ] Advanced search with multiple filters
- [ ] Pagination for large datasets
- [ ] Real-time data updates
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Custom dashboard creation

## 📄 License

This project is licensed under the MIT License.

## 👤 Contact

**Eddie Otudor**  
Email: [edbeeotudor@gmail.com](mailto:edbeeotudor@gmail.com)

## 🙏 Acknowledgments

- Onye Healthcare for the branding and design guidelines
- FHIR community for healthcare interoperability standards
- Next.js team for the excellent framework
- Recharts for the visualization library

---

**Built with ❤️ for better healthcare outcomes**

