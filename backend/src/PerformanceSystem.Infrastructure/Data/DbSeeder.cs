using Microsoft.EntityFrameworkCore;
using PerformanceSystem.Core.Entities;
using PerformanceSystem.Core.Enums;

namespace PerformanceSystem.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(PerformanceDbContext context)
    {
        await SeedRolesAndPermissions(context);
        await SeedDepartmentsAndPositions(context);
        await SeedEmployeesAndUsers(context);
    }

    private static async Task SeedRolesAndPermissions(PerformanceDbContext context)
    {
        if (await context.Roles.AnyAsync())
            return;

        var roles = new List<Role>
        {
            new() { Id = 1, RoleName = "Employee", RoleNameAr = "موظف", Description = "Regular employee" },
            new() { Id = 2, RoleName = "Manager", RoleNameAr = "مدير مباشر", Description = "Direct manager" },
            new() { Id = 3, RoleName = "HR", RoleNameAr = "الموارد البشرية", Description = "HR personnel" },
            new() { Id = 4, RoleName = "Admin", RoleNameAr = "مسؤول النظام", Description = "System administrator" },
            new() { Id = 5, RoleName = "Executive", RoleNameAr = "الإدارة العليا", Description = "Executive management" }
        };

        await context.Roles.AddRangeAsync(roles);

        var permissions = new List<Permission>
        {
            // Goals
            new() { Id = 1, PermissionName = "Goals.View", PermissionNameAr = "عرض الأهداف", Module = "Goals" },
            new() { Id = 2, PermissionName = "Goals.Create", PermissionNameAr = "إنشاء أهداف", Module = "Goals" },
            new() { Id = 3, PermissionName = "Goals.Update", PermissionNameAr = "تعديل الأهداف", Module = "Goals" },
            new() { Id = 4, PermissionName = "Goals.Delete", PermissionNameAr = "حذف الأهداف", Module = "Goals" },
            new() { Id = 5, PermissionName = "Goals.Approve", PermissionNameAr = "اعتماد الأهداف", Module = "Goals" },

            // Evaluation
            new() { Id = 6, PermissionName = "Evaluation.View", PermissionNameAr = "عرض التقييمات", Module = "Evaluation" },
            new() { Id = 7, PermissionName = "Evaluation.Create", PermissionNameAr = "إنشاء تقييم", Module = "Evaluation" },
            new() { Id = 8, PermissionName = "Evaluation.Update", PermissionNameAr = "تعديل التقييم", Module = "Evaluation" },
            new() { Id = 9, PermissionName = "Evaluation.Finalize", PermissionNameAr = "اعتماد التقييم", Module = "Evaluation" },

            // Objections
            new() { Id = 10, PermissionName = "Objections.View", PermissionNameAr = "عرض الاعتراضات", Module = "Objections" },
            new() { Id = 11, PermissionName = "Objections.Create", PermissionNameAr = "تقديم اعتراض", Module = "Objections" },
            new() { Id = 12, PermissionName = "Objections.Decide", PermissionNameAr = "البت في الاعتراض", Module = "Objections" },

            // Reports
            new() { Id = 13, PermissionName = "Reports.View", PermissionNameAr = "عرض التقارير", Module = "Reports" },
            new() { Id = 14, PermissionName = "Reports.Export", PermissionNameAr = "تصدير التقارير", Module = "Reports" },

            // System
            new() { Id = 15, PermissionName = "System.ManageUsers", PermissionNameAr = "إدارة المستخدمين", Module = "System" },
            new() { Id = 16, PermissionName = "System.ManageRoles", PermissionNameAr = "إدارة الأدوار", Module = "System" }
        };

        await context.Permissions.AddRangeAsync(permissions);

        // Assign permissions to roles
        var rolePermissions = new List<RolePermission>
        {
            // Employee: View own data, create objections
            new() { RoleId = 1, PermissionId = 1 },
            new() { RoleId = 1, PermissionId = 6 },
            new() { RoleId = 1, PermissionId = 10 },
            new() { RoleId = 1, PermissionId = 11 },
            new() { RoleId = 1, PermissionId = 13 },

            // Manager: All Employee + Create/Update/Approve Goals and Evaluations
            new() { RoleId = 2, PermissionId = 1 },
            new() { RoleId = 2, PermissionId = 2 },
            new() { RoleId = 2, PermissionId = 3 },
            new() { RoleId = 2, PermissionId = 5 },
            new() { RoleId = 2, PermissionId = 6 },
            new() { RoleId = 2, PermissionId = 7 },
            new() { RoleId = 2, PermissionId = 8 },
            new() { RoleId = 2, PermissionId = 9 },
            new() { RoleId = 2, PermissionId = 10 },
            new() { RoleId = 2, PermissionId = 13 },
            new() { RoleId = 2, PermissionId = 14 },

            // HR: All permissions except System
            new() { RoleId = 3, PermissionId = 1 },
            new() { RoleId = 3, PermissionId = 2 },
            new() { RoleId = 3, PermissionId = 3 },
            new() { RoleId = 3, PermissionId = 4 },
            new() { RoleId = 3, PermissionId = 5 },
            new() { RoleId = 3, PermissionId = 6 },
            new() { RoleId = 3, PermissionId = 7 },
            new() { RoleId = 3, PermissionId = 8 },
            new() { RoleId = 3, PermissionId = 9 },
            new() { RoleId = 3, PermissionId = 10 },
            new() { RoleId = 3, PermissionId = 11 },
            new() { RoleId = 3, PermissionId = 12 },
            new() { RoleId = 3, PermissionId = 13 },
            new() { RoleId = 3, PermissionId = 14 },

            // Admin: All permissions
            new() { RoleId = 4, PermissionId = 1 },
            new() { RoleId = 4, PermissionId = 2 },
            new() { RoleId = 4, PermissionId = 3 },
            new() { RoleId = 4, PermissionId = 4 },
            new() { RoleId = 4, PermissionId = 5 },
            new() { RoleId = 4, PermissionId = 6 },
            new() { RoleId = 4, PermissionId = 7 },
            new() { RoleId = 4, PermissionId = 8 },
            new() { RoleId = 4, PermissionId = 9 },
            new() { RoleId = 4, PermissionId = 10 },
            new() { RoleId = 4, PermissionId = 11 },
            new() { RoleId = 4, PermissionId = 12 },
            new() { RoleId = 4, PermissionId = 13 },
            new() { RoleId = 4, PermissionId = 14 },
            new() { RoleId = 4, PermissionId = 15 },
            new() { RoleId = 4, PermissionId = 16 },

            // Executive: View reports only
            new() { RoleId = 5, PermissionId = 6 },
            new() { RoleId = 5, PermissionId = 13 },
            new() { RoleId = 5, PermissionId = 14 }
        };

        await context.RolePermissions.AddRangeAsync(rolePermissions);
        await context.SaveChangesAsync();
    }

    private static async Task SeedDepartmentsAndPositions(PerformanceDbContext context)
    {
        if (await context.Departments.AnyAsync())
            return;

        var departments = new List<Department>
        {
            new() { Id = 1, DepartmentCode = "IT", DepartmentNameAr = "تقنية المعلومات", DepartmentNameEn = "Information Technology" },
            new() { Id = 2, DepartmentCode = "HR", DepartmentNameAr = "الموارد البشرية", DepartmentNameEn = "Human Resources" },
            new() { Id = 3, DepartmentCode = "FIN", DepartmentNameAr = "المالية", DepartmentNameEn = "Finance" }
        };

        await context.Departments.AddRangeAsync(departments);

        var positions = new List<Position>
        {
            new() { Id = 1, PositionCode = "DEV", PositionNameAr = "مطور برمجيات", PositionNameEn = "Software Developer", Grade = 10 },
            new() { Id = 2, PositionCode = "MGR", PositionNameAr = "مدير", PositionNameEn = "Manager", Grade = 12 },
            new() { Id = 3, PositionCode = "HR-SPEC", PositionNameAr = "أخصائي موارد بشرية", PositionNameEn = "HR Specialist", Grade = 9 }
        };

        await context.Positions.AddRangeAsync(positions);
        await context.SaveChangesAsync();
    }

    private static async Task SeedEmployeesAndUsers(PerformanceDbContext context)
    {
        if (await context.Employees.AnyAsync())
            return;

        var employeeId1 = Guid.NewGuid();
        var employeeId2 = Guid.NewGuid();
        var employeeId3 = Guid.NewGuid();
        var employeeId4 = Guid.NewGuid();
        var employeeId5 = Guid.NewGuid();

        var employees = new List<Employee>
        {
            new()
            {
                Id = employeeId1,
                NationalId = "1234567890",
                EmployeeNumber = "E001",
                FullNameAr = "أحمد محمد",
                FullNameEn = "Ahmed Mohammed",
                Email = "ahmed@example.com",
                DepartmentId = 1,
                PositionId = 1,
                HireDate = new DateTime(2020, 1, 1),
                Grade = 10,
                Status = EmployeeStatus.Active
            },
            new()
            {
                Id = employeeId2,
                NationalId = "2345678901",
                EmployeeNumber = "E002",
                FullNameAr = "سارة أحمد",
                FullNameEn = "Sarah Ahmed",
                Email = "sarah@example.com",
                DepartmentId = 1,
                PositionId = 2,
                HireDate = new DateTime(2019, 1, 1),
                Grade = 12,
                Status = EmployeeStatus.Active
            },
            new()
            {
                Id = employeeId3,
                NationalId = "3456789012",
                EmployeeNumber = "E003",
                FullNameAr = "فاطمة عبدالله",
                FullNameEn = "Fatima Abdullah",
                Email = "fatima@example.com",
                DepartmentId = 2,
                PositionId = 3,
                HireDate = new DateTime(2021, 1, 1),
                Grade = 9,
                Status = EmployeeStatus.Active
            },
            new()
            {
                Id = employeeId4,
                NationalId = "4567890123",
                EmployeeNumber = "E004",
                FullNameAr = "خالد سعيد",
                FullNameEn = "Khaled Saeed",
                Email = "khaled@example.com",
                DepartmentId = 1,
                PositionId = 1,
                HireDate = new DateTime(2022, 1, 1),
                Grade = 10,
                Status = EmployeeStatus.Active
            },
            new()
            {
                Id = employeeId5,
                NationalId = "5678901234",
                EmployeeNumber = "E005",
                FullNameAr = "نورة علي",
                FullNameEn = "Noura Ali",
                Email = "noura@example.com",
                DepartmentId = 3,
                PositionId = 2,
                HireDate = new DateTime(2018, 1, 1),
                Grade = 12,
                Status = EmployeeStatus.Active
            }
        };

        // Set manager relationships
        employees[0].ManagerId = employeeId2; // Ahmed reports to Sarah
        employees[3].ManagerId = employeeId2; // Khaled reports to Sarah

        await context.Employees.AddRangeAsync(employees);

        var users = new List<User>
        {
            new() { Id = Guid.NewGuid(), EmployeeId = employeeId1, Username = "ahmed.mohammed", Email = "ahmed@example.com", IsActive = true },
            new() { Id = Guid.NewGuid(), EmployeeId = employeeId2, Username = "sarah.ahmed", Email = "sarah@example.com", IsActive = true },
            new() { Id = Guid.NewGuid(), EmployeeId = employeeId3, Username = "fatima.abdullah", Email = "fatima@example.com", IsActive = true },
            new() { Id = Guid.NewGuid(), EmployeeId = employeeId4, Username = "khaled.saeed", Email = "khaled@example.com", IsActive = true },
            new() { Id = Guid.NewGuid(), EmployeeId = employeeId5, Username = "noura.ali", Email = "noura@example.com", IsActive = true }
        };

        await context.Users.AddRangeAsync(users);

        var userRoles = new List<UserRole>
        {
            new() { UserId = users[0].Id, RoleId = 1 }, // Ahmed - Employee
            new() { UserId = users[1].Id, RoleId = 2 }, // Sarah - Manager
            new() { UserId = users[2].Id, RoleId = 3 }, // Fatima - HR
            new() { UserId = users[3].Id, RoleId = 1 }, // Khaled - Employee
            new() { UserId = users[4].Id, RoleId = 5 }  // Noura - Executive
        };

        await context.UserRoles.AddRangeAsync(userRoles);
        await context.SaveChangesAsync();
    }
}
