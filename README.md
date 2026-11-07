# devsecops-sdp
 - This is a devsecops **Shift left security** project.


 One issue to fix
 CKV_DOCKER_2 – Ensure that HEALTHCHECK instructions have been added to container images.

 Excellent! Your Checkov Dockerfile scan now reports:
87
Passed
0
Failed
0
Skipped


What we fixed
- Added a Docker HEALTHCHECK instruction.
- Configured periodic checks against /health.
- Kept the container running as the non-root node user.
- Addressed Checkov policy CKV_DOCKER_2.

This is a useful portfolio milestone: your Dockerfile has passed all 87 checks in this Checkov scan. It is evidence of compliance with the checks run, not a guarantee that the image has no security vulnerabilities.