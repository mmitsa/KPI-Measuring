namespace PerformanceSystem.Core.Entities;

public class Department
{
    public int Id { get; set; }
    public string DepartmentCode { get; set; } = string.Empty;
    public string DepartmentNameAr { get; set; } = string.Empty;
    public string? DepartmentNameEn { get; set; }
    public int? ParentDepartmentId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Department? ParentDepartment { get; set; }
    public ICollection<Department> SubDepartments { get; set; } = new List<Department>();
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
