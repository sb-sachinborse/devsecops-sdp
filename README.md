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

*************************************

Good news: Docker Hub login and image push both succeeded. The failure is only in our digest extraction command—not in Docker or Cosign.
Why it failed
Your Docker output contains:
8a8585c2695491fa05e77a37b7112f4e41a02852: digest: sha256:6933207d9133f93dc02566093251fdb9686227b1cce83593dfd257826446a241 size: 2606


Our original command used $2, but the digest is in field $3.
Step 1 — Fix the digest extraction
Open the workflow:
nano .github/workflows/ci.yml


Find:
DIGEST="$(awk '/digest: sha256:/ {print $2}' docker-push.log | tail -n 1)"


Replace it with:
DIGEST="$(awk '/digest: sha256:/ {print $3}' docker-push.log | tail -n 1)"


Save and exit.

******************************************