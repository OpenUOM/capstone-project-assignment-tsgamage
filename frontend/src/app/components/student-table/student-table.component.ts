import { Component, OnInit } from '@angular/core';
import { Router,NavigationExtras } from '@angular/router';
import { faTrash, faPlus, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import {AppServiceService} from '../../app-service.service';
@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.css']
})
export class StudentTableComponent implements OnInit {

  faTrash = faTrash;
  faPlus = faPlus;
  faPenSquare = faPenSquare;
  studentData: any;
  selected: any;

  constructor(private service : AppServiceService, private router: Router) { }

  ngOnInit(): void {
    this.getStudentData();
  }

  addNewStudent() {
    this.router.navigate(['addStudent']); // Ensure the route matches the expected one
  }

  editStudent(id: string) {
    const navigationExtras: NavigationExtras = {
      state: { id: id }, // Pass the student ID as state
    };
    this.router.navigate(['editStudent'], navigationExtras); // Ensure the route matches the expected one
  }

  getStudentData(){
    this.service.getStudentData().subscribe((response)=>{
      this.studentData = Object.keys(response).map((key) => [response[key]]);
    },(error)=>{
      console.log('ERROR - ', error)
    })
  }

  deleteStudent(itemid: string) {
    const student = { id: itemid }; // Ensure the payload matches the backend's expected format
    this.service.deleteStudent(student).subscribe(
      (response) => {
        console.log('Student deleted successfully:', response);
        this.getStudentData(); // Refresh the data after deletion
      },
      (error) => {
        console.error('Error deleting student:', error);
      }
    );
  }

  search(value: string) {
    if (value.trim().length === 0) {
      this.getStudentData(); // Reset to original data if search input is empty
    } else {
      this.studentData = this.studentData.filter((student) => {
        const studentObj = Array.isArray(student) ? student[0] : student; // Handle wrapped structure
        return studentObj.name.toLowerCase().includes(value.toLowerCase());
      });
    }
  }
}
