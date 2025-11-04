using PerformanceSystem.Core.Enums;

namespace PerformanceSystem.Core.Entities;

public class Employee : BaseEntity
{
    public string NationalId { get; set; } = string.Empty;
    public string EmployeeNumber { get; set; } = string.Empty;
    public string FullNameAr { get; set; } = string.Empty;
    public string? FullNameEn { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }

    public int DepartmentId { get; set; }
    public int PositionId { get; set; }
    public Guid? ManagerId { get; set; }

    public DateTime HireDate { get; set; }
    public int? Grade { get; set; }
    public EmployeeStatus Status { get; set; } = EmployeeStatus.Active;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public Department? Department { get; set; }
    public Position? Position { get; set; }
    public Employee? Manager { get; set; }
    public ICollection<Employee> Subordinates { get; set; } = new List<Employee>();

    public User? User { get; set; }
    public ICollection<Goal> Goals { get; set; } = new List<Goal>();
    public ICollection<Evaluation> Evaluations { get; set; } = new List<Evaluation>();
    public ICollection<Objection> Objections { get; set; } = new List<Objection>();
    public ICollection<PIP> PIPs { get; set; } = new List<PIP>();
    public ICollection<TrainingResult> TrainingResults { get; set; } = new List<TrainingResult>();
}
