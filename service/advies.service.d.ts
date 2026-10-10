export declare const AdviesService: {
    genereerAdvies(studentId: string): Promise<{
        error: string;
        status: number;
        advies?: never;
    } | {
        advies: {
            bookId: string;
            book: {
                Titel: any;
                Auteur: any;
                type: any;
                niveau: any;
                thema: any;
                beschrijving: any;
            } | null;
            reason: string;
        }[];
        error?: never;
        status?: never;
    }>;
};
//# sourceMappingURL=advies.service.d.ts.map