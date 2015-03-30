<?php

namespace IP\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class CreateController extends Controller
{
    /**
     * Display the view to list all resources
     * @return string
     */
    public function indexAction()
    {
        $name = 'Test';

        return $this->render('IPUserBundle:Create:index.html.twig', compact('name'));
    }
}
