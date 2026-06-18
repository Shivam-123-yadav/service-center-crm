# ORM Practice (Important)
# Get all tickets

Ticket.objects.all()




# Open tickets

Ticket.objects.filter(
    status="open"
)


# High Priority Tickets

Ticket.objects.filter(
    priority="high"
)



# Tickets of Customer

customer.tickets.all()

# Thanks to:

related_name="tickets"

# Tickets Assigned To Technician

user.assigned_tickets.all()

