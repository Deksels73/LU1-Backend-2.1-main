export declare const DocentService: {
    getStudents(teacherId: number): Promise<{
        id: number | null;
        name: string | null;
        code: string | null;
    }[]>;
    heeftStudent(teacherId: number, studentId: string | number): Promise<boolean>;
    getLeeslijst(studentId: string): Promise<{
        book: {
            Titel: any;
            Auteur: any;
            type: any;
            niveau: any;
            thema: any;
            beschrijving: any;
        } | null;
        id: number;
        studentId: string;
        bookId: string;
        gelezen: boolean | null;
    }[]>;
    addBook(studentId: string, bookId: string): Promise<{
        success: boolean;
    } | {
        error: string;
        status: number;
    }>;
};
//# sourceMappingURL=docent.service.d.ts.map