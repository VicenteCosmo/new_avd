import { Courses } from "./app/(training_module)/get_courses/columns";

class APis {
    public constructor() {}

    public formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        
        const date = new Date(dateString);
        
        // Validação mais robusta da data
        if (isNaN(date.getTime())) {
            console.error('Data inválida:', dateString);
            return 'Data inválida';
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    public async getWorkerSignedIn(){
        try {
          const response = await fetch('https://backend-django-2-7qpl.onrender.com/api/funcionarios/all/');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log(data)
          return data;
        } catch (error) {
          console.error('Error fetching enrolled trainees:', error);
          return [];
        }
      }

    public async getData(): Promise<Courses[]> {
        try {
            const response = await fetch('https://avd-trainings.onrender.com/trainings/get_courses');
            const data = await response.json();
            const message = data.message;
            
            console.log(message);

            // Handle both array and single object cases

            const date = new Date('01-02-2025')
            // console.log('Date:', date)

            

            const coursesArray = Array.isArray(message) ? message : [message];
            
            return coursesArray.map((course: any) => ({
            id: course.id,
            course_name: course.courses,
            status: "pending",
            course_description: course.description,
            course_init_date: this.formatDate(course.init_date),
            course_finish_date: this.formatDate(course.finish_date),
            course_instructors: course.instructors,
            course_requirements: course.requirements
            }));
        } catch (error) {
            console.error("Error fetching courses:", error);
            return [];
        } 
    }

}

export const APIs = new APis()